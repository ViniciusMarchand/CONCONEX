using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IVerificationCodeRepository
{
    Task<VerificationCode?> GetByEmail(string email);
    Task CreateAsync(VerificationCode vc);
    Task RemoveAsync(string id);
}