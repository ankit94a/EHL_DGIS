namespace EHL.Api.Authorization
{
	public class SessionManager(IHttpContextAccessor httpContextAccessor)
	{
		private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

		public void ClearAllSessionsAndCookies()
		{

			foreach (var key in _httpContextAccessor.HttpContext.Session.Keys.ToList())
			{
				_httpContextAccessor.HttpContext.Session.Remove(key);
			}


			foreach (var cookie in _httpContextAccessor.HttpContext.Request.Cookies.Keys)
			{
				_httpContextAccessor.HttpContext.Response.Cookies.Delete(cookie, new CookieOptions
				{
					HttpOnly = true,
					Secure = true,
					SameSite = SameSiteMode.None
				});
			}
		}


		private string GetOrSetValue(string key, string value = null)
		{
			if (value != null)
			{
				SetSessionValue(key, value);
				SetCookieValue(key, value);
			}


			var cookieValue = GetCookieValue(key);
			if (string.IsNullOrEmpty(cookieValue))
			{
				cookieValue = GetSessionValue(key);
				if (!string.IsNullOrEmpty(cookieValue))
				{
					SetCookieValue(key, cookieValue);
				}
			}
			return cookieValue;
		}

		public long UserId
		{
			get
			{
				var value = GetOrSetValue("UserId");
				if (long.TryParse(value, out var intValue))
				{
					return intValue;
				}
				else
				{

					Logout();
					return 0;
				}
			}
			set => GetOrSetValue("UserId", value.ToString());
		}

		public string UserName
		{
			get => GetOrSetValue("UserName");
			set => GetOrSetValue("UserName", value);
		}
		public string Access_Token
		{
			get => GetOrSetValue("access_token");
			set => GetOrSetValue("access_token", value);
		}
		public string SessionId
		{
			get
			{
				var sessionId = GetOrSetValue("SessionId");
				if (string.IsNullOrEmpty(sessionId))
				{
					sessionId = Guid.NewGuid().ToString();
					SetSessionValue("SessionId", sessionId);
					SetCookieValue("SessionId", sessionId);
				}
				return sessionId;
			}
			set => GetOrSetValue("SessionId", value);
		}
		public string RoleId
		{
			get => GetOrSetValue("RoleId");
			set => GetOrSetValue("RoleId", value);

		}

		public string RoleType
		{
			get => GetOrSetValue("RoleType");
			set => GetOrSetValue("RoleType", value);
		}

		public string Logout()
		{

			ClearAllSessionsAndCookies();
			return "User logged out successfully";

		}


		private string GetSessionValue(string key) => _httpContextAccessor.HttpContext.Session.GetString(key);

		private void SetSessionValue(string key, string value) => _httpContextAccessor.HttpContext.Session.SetString(key, value);

		private string GetCookieValue(string key) => _httpContextAccessor.HttpContext.Request.Cookies[key];

		private void SetCookieValue(string key, string value)
		{
			_httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, new CookieOptions
			{
				Expires = DateTimeOffset.UtcNow.AddMinutes(10),
				HttpOnly = true,
				Secure = _httpContextAccessor.HttpContext.Request.IsHttps,
				SameSite = SameSiteMode.None
			});
		}
	}
}
