namespace Backend.DTO;

public class RegisterTokenRequestDTO
{
    public string UserId { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string DeviceInfo { get; set; } = string.Empty;
}  