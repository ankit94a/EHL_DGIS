namespace EHL.Api.Helpers
{
    public class OriginRestrictionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<OriginRestrictionMiddleware> _logger;

        private readonly string[] _allowedOrigins = new[]
        {
        "http://localhost:4200",
        "https://10.0.0.80"
    };

        public OriginRestrictionMiddleware(RequestDelegate next, ILogger<OriginRestrictionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var origin = context.Request.Headers["Origin"].ToString();
            var referer = context.Request.Headers["Referer"].ToString();

            bool isValid = _allowedOrigins.Any(allowed =>
                (!string.IsNullOrEmpty(origin) && origin.Contains(allowed)) ||
                (!string.IsNullOrEmpty(referer) && referer.Contains(allowed)));

            // Optional: exclude Swagger or specific endpoints
            var path = context.Request.Path.Value.ToLowerInvariant();
            if (path == "/api/status")
            {
                await _next(context);
                return;
            }
            if (path != null && (path.StartsWith("/swagger") || path.StartsWith("/favicon.ico")))
            {
                await _next(context);
                return;
            }

            if (!isValid)
            {
                _logger.LogWarning($"Blocked request from origin: {origin}, referer: {referer}");
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden: Invalid origin or referer.");
                return;
            }

            await _next(context);
        }
    }

}
