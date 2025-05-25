using Backend.Models;

namespace Backend.DTO;

public class ProjectChatDTO
{
public Guid ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public int UnreadMessages { get; set; }
    public string ProjectImage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
    public Message? LastMessage { get; set; } = new();
}