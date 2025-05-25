namespace Backend.Services.Interfaces;

public interface IPushNotificationService
{
    Task SendPushNotificationAsync(string userId, string title, string body);
}