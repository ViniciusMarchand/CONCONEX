using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class VerificationCodeService(IVerificationCodeRepository verificationCodeRepository) : IVerificationCodeService
{
    private readonly IVerificationCodeRepository _verificationCodeRepository = verificationCodeRepository;
    
    public async Task<string> GenerateVerificationCode(string email)
    {
        Random random = new();

        int number;
        
        do
        {
            number = random.Next(100000, 1000000);
        } while (number.ToString().StartsWith("0"));

        VerificationCode verificationCode = new()
        {
            Email = email,
            Code = number.ToString()
        };

        VerificationCode? oldVerificationCode = await _verificationCodeRepository.GetByEmail(email);

        if(oldVerificationCode != null)
            await _verificationCodeRepository.RemoveAsync(oldVerificationCode.Id!);

        await _verificationCodeRepository.CreateAsync(verificationCode);

        return verificationCode.Code;
    }


    public async Task<bool> IsValid(VerificationCodeRequestDTO dto)
    {
        VerificationCode verificationCode = await _verificationCodeRepository.GetByEmail(dto.Email) ?? throw new EntityNotFoundException("Verification code not found.");

        if(verificationCode.Code == dto.Code)
            return true;

        return false;
    }
}