using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public record UserLoginDTO
    {
        [Required]
        public string Email { get; init; } = string.Empty;

        [Required]
        public string Password { get; init; } = string.Empty;
    }
}