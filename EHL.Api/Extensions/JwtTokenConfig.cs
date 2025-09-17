using EHL.Api.Authorization;
using InSync.Api.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Text;

namespace InSync.Api.Extensions
{
    public static class JwtTokenConfig
    {
        public static void AddJwtTokenAuthentication(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtConfig>(configuration.GetSection("JWTSettings"));
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                                    .AddJwtBearer(x =>
                                    {

                                        x.TokenValidationParameters = new TokenValidationParameters()
                                        {
                                            ValidateIssuerSigningKey = true,
                                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"])),
                                            ValidateIssuer = true,
                                            ValidateAudience = true,
                                            ValidateLifetime = true,
                                            ValidIssuer = configuration["JWTSettings:Issuer"],
                                            ValidAudience = configuration["JWTSettings:Audience"],

                                            ClockSkew = TimeSpan.Zero,
                                        };
                                        x.RequireHttpsMetadata = false;
                                        x.SaveToken = true;
                                        x.Events = new JwtBearerEvents()
                                        {
                                            OnMessageReceived = context =>
                                            {
                                                if (context.HttpContext.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
                                                {
                                                    var token = context.HttpContext.Request.Cookies["auth_token"];
                                                    if (!string.IsNullOrEmpty(token))
                                                    {
                                                        context.Token = token;
                                                    }
                                                }
                                                else
                                                {
                                                    context.NoResult();
                                                }

                                                return Task.CompletedTask;
                                            }
,
                                            OnAuthenticationFailed = context =>
                                            {
                                                var endpoint = context.HttpContext.GetEndpoint();
                                                var allowsAnonymous = endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null;

                                                if (allowsAnonymous)
                                                {
                                                    return Task.CompletedTask;
                                                }
                                                if(context.Exception is SecurityTokenExpiredException)
                                                {
                                                    throw new UnauthorizedAccessException("Token has Expired");
                                                }

                                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                                context.Response.ContentType = "application/json";
                                                var result = System.Text.Json.JsonSerializer.Serialize(new
                                                {
                                                    status = "455",
                                                    message = "Authorization token is missing or invalid."
                                                });
                                                return context.Response.WriteAsync(result);
                                               
                                            },
                                            OnChallenge = context =>
                                            {
                                                context.HandleResponse();
                                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                                context.Response.ContentType = "application/json";
                                                var result = System.Text.Json.JsonSerializer.Serialize(new
                                                {
                                                    status = "455",
                                                    message = "Authorization token is missing or invalid."
                                                });
                                                return context.Response.WriteAsync(result);
                                              
                                            },
                                            OnForbidden = context =>
                                            {
                                                throw new UnauthorizedAccessException("You are not authorized to access this resource.");
                                            },
                                        };
                                    });

        }
    }
}