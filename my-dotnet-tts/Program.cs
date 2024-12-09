using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.CognitiveServices.Speech;

var builder = WebApplication.CreateBuilder(args);

//----------------------------
// Services Configuration
//----------------------------
builder.Services.AddCors(options =>
{
    // Adjust allowed origins as needed
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
        // Add .AllowCredentials() if needed
    });
});

// Optionally add logging if needed
// builder.Services.AddLogging();

//----------------------------
// Build the app
//----------------------------
var app = builder.Build();

//----------------------------
// Middlewares
//----------------------------

// Global exception handler middleware (Optional)
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Log the error if a logging service is configured (not shown)
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Internal server error: {ex.Message}");
    }
});

app.UseCors("AllowSpecificOrigin");

// Handle OPTIONS requests explicitly (CORS preflight)
app.MapMethods("/api/tts", new[] { "OPTIONS" }, async (HttpContext context) =>
{
    context.Response.StatusCode = 200;
    await Task.CompletedTask;
});

//----------------------------
// Endpoints
//----------------------------
app.MapPost("/api/tts", async (HttpContext context) =>
{
    // Attempt to parse incoming JSON
    var request = await context.Request.ReadFromJsonAsync<TtsRequest>();
    if (request == null || string.IsNullOrEmpty(request.Text))
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("Invalid request. 'Text' is required.");
        return;
    }

    // Retrieve environment variables for speech configuration
    var speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
    var speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION");

    if (string.IsNullOrEmpty(speechKey) || string.IsNullOrEmpty(speechRegion))
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("Missing speech configuration. Ensure SPEECH_KEY and SPEECH_REGION are set.");
        return;
    }

    var config = SpeechConfig.FromSubscription(speechKey, speechRegion);
    // Consider making the voice name configurable or determined by the user request
    config.SpeechSynthesisVoiceName = "en-US-AvaMultilingualNeural";

    try
    {
        // Create a synthesizer and speak the text
        using var synthesizer = new SpeechSynthesizer(config);
        var result = await synthesizer.SpeakTextAsync(request.Text);

        if (result.Reason == ResultReason.SynthesizingAudioCompleted)
        {
            // Return the audio data to the client
            context.Response.ContentType = "audio/wav";
            await context.Response.Body.WriteAsync(result.AudioData);
        }
        else
        {
            context.Response.StatusCode = 500;
            var cancellation = SpeechSynthesisCancellationDetails.FromResult(result);
            await context.Response.WriteAsync($"TTS failed: {cancellation.ErrorDetails}");
        }
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Internal server error during speech synthesis: {ex.Message}");
    }
});

//----------------------------
// Run the application
//----------------------------
app.Run();

//----------------------------
// Support Classes
//----------------------------
public class TtsRequest
{
    public string Text { get; set; }
}
