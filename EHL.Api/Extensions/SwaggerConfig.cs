using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;

namespace BIS.Api.Extensions
{
	public static class SwaggerConfig
	{
		public static void AddSwaggerConfiguration(this IServiceCollection services)
		{
			if (services == null)
			{
				throw new ArgumentNullException(nameof(services));
			}

			services.AddSwaggerGen(s =>
			{
				s.SwaggerDoc("v2", new OpenApiInfo
				{
					Version = "v2",
					Title = "EHL",
					Description = "Indian Army Web API",
				});
				s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Description = "Input the JWT like: Bearer {your token}",
					Name = "Authorization",
					Scheme = "Bearer",
					BearerFormat = "JWT",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.ApiKey,
				});
				s.AddSecurityRequirement(new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer",
							},
						},
						Array.Empty<string>()
					},
				});
				
			});
		}

		public static void UseSwaggerSetup(this IApplicationBuilder app)
		{
			if (app == null)
			{
				throw new ArgumentNullException(nameof(app));
			}

			app.UseSwagger();
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("v2/swagger.json", "v2");
				c.RoutePrefix = "swagger";
				c.DefaultModelsExpandDepth(-1);
			});
		}


	}
}