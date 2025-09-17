using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace EHL.Common.Helpers
{
    public class LoginAttemptService
    {
        private readonly IMemoryCache _cache;
        private readonly int _maxAttempts = 3;
        private readonly TimeSpan _blockDuration = TimeSpan.FromMinutes(15);

        public LoginAttemptService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public bool IsBlocked(string ip)
        {
            if (_cache.TryGetValue($"{ip}_blocked", out _))
            {
                return true;
            }
            return false;
        }

        public void RecordFailedAttempt(string ip)
        {
            var key = $"{ip}_attempts";
            int attempts = 0;

            if (_cache.TryGetValue(key, out int currentAttempts))
            {
                attempts = currentAttempts;
            }

            attempts++;
            _cache.Set(key, attempts, TimeSpan.FromMinutes(15));

            if (attempts >= _maxAttempts)
            {
                _cache.Set($"{ip}_blocked", true, _blockDuration);
            }
        }

        public void ResetAttempts(string ip)
        {
            _cache.Remove($"{ip}_attempts");
            _cache.Remove($"{ip}_blocked");
        }
    }

}