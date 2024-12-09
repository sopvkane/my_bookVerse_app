// using Microsoft.AspNetCore.Builder;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Hosting;

// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// builder.Services.AddControllers();
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAllOrigins", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyMethod()
//               .AllowAnyHeader();
//     });
// });

// var app = builder.Build();

// // Enable CORS
// app.UseCors("AllowAllOrigins");

// app.UseRouting();
// app.UseAuthorization();
// app.MapControllers();

// app.Run();
