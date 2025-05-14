namespace Backend.DTO;

public class LoginResponseDTO
{
    public string AccessToken { get; set; } = string.Empty;
    public UserResponseDTO User { get; set; } = new();
}

