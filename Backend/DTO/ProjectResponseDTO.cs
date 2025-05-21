namespace Backend.DTO;

public class ProjectResponseDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public UserInfoDTO UserInfo { get; set; } = new();
    public DateTime Deadline { get; set; }
    public string? AdminId { get; set; } = string.Empty;
    public string? Image { get; set; } = string.Empty;
}