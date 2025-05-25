namespace Backend.Models;

public class UserPushToken
{
    public int Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public string DeviceInfo { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = new();
}