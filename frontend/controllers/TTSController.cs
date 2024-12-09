using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace Frontend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TTSController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public TTSController()
        {
            _httpClient = new HttpClient();
        }

        [HttpPost]
        public async Task<IActionResult> SynthesizeSpeech([FromBody] TtsRequest request)
        {
            var subscriptionKey = Environment.GetEnvironmentVariable("SPEECH_KEY");
            var region = Environment.GetEnvironmentVariable("SPEECH_REGION");
            var endpoint = $"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1";

            if (string.IsNullOrWhiteSpace(subscriptionKey) || string.IsNullOrWhiteSpace(region))
            {
                return StatusCode(500, "Missing speech configuration.");
            }

            // Build SSML or use the request.Text directly depending on the TTS requirements
            var ssml = GenerateSsml(request.Text); // Implement GenerateSsml if needed
            
            try
            {
                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint);
                requestMessage.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                requestMessage.Content = new StringContent(ssml);
                requestMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/ssml+xml");

                var response = await _httpClient.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    var audioData = await response.Content.ReadAsByteArrayAsync();
                    return File(audioData, "audio/wav");
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
