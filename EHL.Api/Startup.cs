using System;
using Newtonsoft.Json;
using BIS.API.Filters;
using BIS.API.IOC;
using BIS.Api.Extensions;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Net;
using EHL.Common.Helpers;
using InSync.Api.Extensions;
using Microsoft.OpenApi.Models;
using EHL.Api.Authorization;
using EHL.Api.Helpers;



namespace EHL.Api
{
	public class Startup
	{
		readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
		public IConfiguration Configuration { get; }
		private readonly IWebHostEnvironment _env;
		public Startup(IConfiguration configuration, IWebHostEnvironment env)
		{
			Configuration = configuration;
			_env = env;
		}
		public void ConfigureServices(IServiceCollection services)
		{

			IoCConfiguration.Configuration(services);
			services.AddSingleton<EncriptionService>();
			services.AddSingleton<LoginAttemptService>();
			services.AddSingleton<RSAKeyManager>();
			services.AddSingleton(Configuration);
			services.AddCors(options =>
			{
				options.AddPolicy("_myAllowSpecificOrigins", builder =>
				{
					builder.WithOrigins("http://localhost:4200")
						   //builder.WithOrigins("https://10.0.0.80")
						   .WithMethods("GET", "POST")
						   .AllowAnyHeader().AllowCredentials();
				});
			});
			services.AddResponseCompression(options =>
			{
				options.EnableForHttps = true;
			});
			services.AddControllers().AddJsonOptions(options =>
			{
				options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

			});
			JwtTokenConfig.AddJwtTokenAuthentication(services, Configuration);

			//if (_env.IsDevelopment())
			//{
			services.AddSwaggerConfiguration();
			//}

			var nullValueSettings = new JsonSerializerSettings
			{
				NullValueHandling = NullValueHandling.Ignore,
				MissingMemberHandling = MissingMemberHandling.Ignore
			};
			services.AddMvc(options =>
			{
				options.Filters.Add(typeof(ValidateModelFilter));
			}).AddDataAnnotationsLocalization();
			services.AddMemoryCache();

		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			//if (env.IsDevelopment())
			//{
			//    app.UseDeveloperExceptionPage();
			//    app.UseSwaggerSetup();

			//    app.UseSwagger();
			//    app.UseSwaggerUI(c =>
			//    {
			//        c.SwaggerEndpoint("/swagger/v2/swagger.json", "EHL API v2");
			//        c.RoutePrefix = string.Empty;
			//    });
			//}
			//else {
			//    app.UseExceptionHandler("/error");
			//    app.Use(async (context, next) =>
			//    {
			//        var path = context.Request.Path.Value?.ToLowerInvariant();
			//        if (path != null && (path.StartsWith("/swagger") || path == "/swagger-ui.html" || path.EndsWith("swagger.json")))
			//        {
			//            context.Response.StatusCode = StatusCodes.Status404NotFound;
			//            await context.Response.WriteAsync("API documentaion is not avaiable in production environment.");
			//            return;
			//        }
			//        if (string.IsNullOrEmpty(path) || path == "/" || path == "/index.html")
			//        {
			//            context.Response.Redirect("/api/status");
			//            return;
			//        }
			//        await next();
			//    });
			//}
			app.UseDeveloperExceptionPage();
			app.UseSwaggerSetup();

			app.UseSwagger();
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v2/swagger.json", "EHL API v2");
				c.RoutePrefix = string.Empty;
			});
			app.Use(async (context, next) =>
				{
					context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
					context.Response.Headers.Add("X-Frame-Options", "DENY");
					context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
					context.Response.Headers.Add("Referrer-Policy", "no-referrer");
					context.Response.Headers.Add("Permissions-Policy", "geolocation=(), microphone=()");
					context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
					context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; " + "script-src 'self'; " + "img-src 'self'; " + "font-src 'self'; " + "connect-src 'self'; " + "object-src 'none'; " + "frame-ancestors 'none'; " + "form-action 'self'; " + "base-uri 'self';");

					await next();
				});
			app.UseStaticFiles();
			app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
			app.UseWebSockets();
			app.UseRouting();
			app.UseMiddleware<OriginRestrictionMiddleware>();

			app.UseCors("_myAllowSpecificOrigins");
			app.UseCookiePolicy();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseResponseCompression();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
