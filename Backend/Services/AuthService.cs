using System.Text.RegularExpressions;
using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;


namespace Backend.Services;
public partial class AuthService(
    IAuthRepository authRepository, 
    ITokenGeneratorService tokenGeneratorService
) : IAuthService
{
    readonly IAuthRepository _authRepository = authRepository;
    readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;


    public async Task<AccessTokenDTO> Login(UserLoginDTO dto)
    {

        User user = await _authRepository.Login(dto);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        {
            throw new EntityNotFoundException("Email or password invalid.");
        }


        AccessTokenDTO token = new()
        {
            AccessToken = _tokenGeneratorService.GenerateToken(user)
        };

        return token;
    }

    public async Task<User> Register(UserDTO dto)
    {

        var Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var emailRegex = MyRegex();

        if (!emailRegex.IsMatch(dto.Email))
            throw new Exception("Invalid email");
        
        var user = new User
        {
            Username = dto.Username,
            Password = Password,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email
        };
        
        return await _authRepository.Register(user);
    }

    public async Task Delete(User user)
    {
        await _authRepository.Delete(user);
    }

    public async Task<User> FindUserByEmail(string email)
    {
        return await _authRepository.FindUserByEmail(email);
    }

    public async Task ValidateUser(string email)
    {
        User user = await _authRepository.FindUserByEmail(email);

        user.EmailConfirmed = true;

        await _authRepository.Update(user);
    }

    [GeneratedRegex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$")]
    private static partial Regex MyRegex();

}
