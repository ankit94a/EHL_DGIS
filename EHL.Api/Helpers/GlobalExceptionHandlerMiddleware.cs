using EHL.Common.Models;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace EHL.Api.Helpers
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.ContentType = "application/json";

                var response = context.Response;
                var errorResponse = new ErrorResponse();

                switch (ex)
                {
                    case ArgumentNullException:
                        response.StatusCode = StatusCodes.Status400BadRequest;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "ARGUMENT_NULL";
                        errorResponse.ErrorMessage = "A required argument was null.";
                        errorResponse.Details = ex.Message;
                        break;

                    case ArgumentException:
                        response.StatusCode = StatusCodes.Status400BadRequest;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "INVALID_ARGUMENT";
                        errorResponse.ErrorMessage = "An invalid argument was provided.";
                        errorResponse.Details = ex.Message;
                        break;

                    case FormatException:
                        response.StatusCode = StatusCodes.Status400BadRequest;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "FORMAT_ERROR";
                        errorResponse.ErrorMessage = "The input format is incorrect.";
                        errorResponse.Details = ex.Message;
                        break;
                    case SecurityTokenException:
                        response.StatusCode = StatusCodes.Status401Unauthorized;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "INVALID_TOKEN";
                        errorResponse.ErrorMessage = ex.Message;
                        break;

                    case InvalidOperationException:
                        response.StatusCode = StatusCodes.Status409Conflict;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "INVALID_OPERATION";
                        errorResponse.ErrorMessage = "The operation is not valid in the current state.";
                        errorResponse.Details = ex.Message;
                        break;

                    case UnauthorizedAccessException:
                        response.StatusCode = StatusCodes.Status403Forbidden;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "FORBIDDEN";
                        errorResponse.ErrorMessage = "You do not have permission to access this resource.";
                        errorResponse.ErrorMessage = ex.Message;
                        break;

                    case KeyNotFoundException:
                        response.StatusCode = StatusCodes.Status404NotFound;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "KEY_NOT_FOUND";
                        errorResponse.ErrorMessage = "The requested resource was not found.";
                        errorResponse.Details = ex.Message;
                        break;

                    case NotImplementedException:
                        response.StatusCode = StatusCodes.Status501NotImplemented;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "NOT_IMPLEMENTED";
                        errorResponse.ErrorMessage = "This functionality is not implemented.";
                        errorResponse.Details = ex.Message;
                        break;

                    case TimeoutException:
                        response.StatusCode = StatusCodes.Status504GatewayTimeout;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "TIMEOUT";
                        errorResponse.ErrorMessage = "The operation timed out.";
                        errorResponse.Details = ex.Message;
                        break;

                    case NullReferenceException:
                        response.StatusCode = StatusCodes.Status500InternalServerError;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "NULL_REFERENCE";
                        errorResponse.ErrorMessage = "Something was null that shouldn't be.";
                        errorResponse.Details = ex.Message;
                        break;

                    default:
                        response.StatusCode = StatusCodes.Status500InternalServerError;
                        errorResponse.StatusCode = response.StatusCode;
                        errorResponse.ErrorCode = "INTERNAL_SERVER_ERROR";
                        errorResponse.ErrorMessage = "An unexpected error occurred.";
                        errorResponse.Details = ex.Message;
                        break;
                }


                var json = JsonConvert.SerializeObject(errorResponse);
                await context.Response.WriteAsync(json);
            }
        }
    }

}
