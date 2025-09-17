using BIS.API;
using EHL.Api;
using Microsoft.AspNetCore.Hosting;
using NLog.Web;
public class Program
{
	public static void Main(string[] args)
	{
		CreateHostBuilder(args).Build().Run();
	}
	public static IHostBuilder CreateHostBuilder(string[] args) =>
		Host.CreateDefaultBuilder(args)
		.ConfigureAppConfiguration((hostContext, config) =>
		{
			config.AddJsonFile($"appsettings.{hostContext.HostingEnvironment.EnvironmentName}.json", optional: false, reloadOnChange: true);
			config.AddEnvironmentVariables();

		}).ConfigureWebHostDefaults(webBuilder =>
		{
			webBuilder.ConfigureKestrel(serverOptions =>
			{
				serverOptions.Limits.MaxRequestBodySize = 104857600;
			});
			webBuilder.UseStartup<Startup>();

		}).UseNLog();
}
