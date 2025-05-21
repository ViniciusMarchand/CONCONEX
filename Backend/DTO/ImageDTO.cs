using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class ImageDTO
{
    [Required]
    public Guid ProjectStageId { get; set; }

    [Required]
    public required IFormFile Image { get; set; }
}