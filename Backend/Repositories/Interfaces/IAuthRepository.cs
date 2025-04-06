using Backend.DTO;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IAuthRepository
{
    Task<User> FindUserByEmail(string email);
    Task<User> Login(UserLoginDTO dto);
    Task<User> Register(User user);
    Task Delete(User user);
    Task Update(User user);
}

