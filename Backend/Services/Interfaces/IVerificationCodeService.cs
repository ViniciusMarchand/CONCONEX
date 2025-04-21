using Backend.DTO;

namespace Backend.Services.Interfaces;

public interface IVerificationCodeService
{
    // Task ValidateUser(string email);
    Task<string> GenerateVerificationCode(string email);
    Task<bool> IsValid(VerificationCodeRequestDTO dto);
}