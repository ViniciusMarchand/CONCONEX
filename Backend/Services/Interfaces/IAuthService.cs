using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    string FindUserIdByClaims();
    Task<AccessTokenDTO> Login(UserLoginDTO dto);
    Task<User> Register(UserDTO dto);
    Task<User> FindUserByEmail(string email);
    Task ValidateUser(string email);
    Task CreateAuthorizationAsync(Authorization authorization);
}
