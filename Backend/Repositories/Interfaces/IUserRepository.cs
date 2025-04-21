using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> FindByIdAsync(string id);
}