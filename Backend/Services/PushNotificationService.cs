using System.Net.Http;
using System.Text;
using System.Text.Json;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

public class PushNotificationService(IUserPushTokenRepository tokenRepository, IHttpClientFactory httpClientFactory) : IPushNotificationService
{
    private readonly IUserPushTokenRepository _tokenRepository = tokenRepository;
    private readonly HttpClient _httpClient = httpClientFactory.CreateClient();

    public async Task SendPushNotificationAsync(string userId, string title, string body)
    {
        var tokens = await _tokenRepository.GetTokensByUserIdAsync(userId);
        if (tokens == null || tokens.Count == 0) return;

        foreach (var token in tokens)
        {
            var payload = new
            {
                To = token.Token,
                Title = title,
                Body = body
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://exp.host/--/api/v2/push/send", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Failed to send notification: {error}");
            }
        }
    }
}
