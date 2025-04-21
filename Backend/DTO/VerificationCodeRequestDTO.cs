using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class VerificationCodeRequestDTO
{
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Length(6, 6)]
    public string Code { get; set; } = string.Empty;
}