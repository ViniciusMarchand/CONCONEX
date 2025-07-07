namespace Backend.DTO;
public class MessageDTO
{
    public Guid ProjectId { get; set; }
    public string? Content { get; set; } = string.Empty;

    public IFormFile? Attachment { get; set; }
}