using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    string FindUserIdByClaims();
    Task<LoginResponseDTO> Login(UserLoginDTO dto);
    Task<User> Register(UserDTO dto);
    Task<User> FindUserByEmail(string email);
    Task<User> FindByUsername(string email);
    Task ValidateUser(string email);
    Task CreateAuthorizationAsync(Authorization authorization);
    Task<UserResponseDTO> UserInfo();
}
