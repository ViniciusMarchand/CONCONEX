using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ITokenGeneratorService
{
    string GenerateToken(User user);
}