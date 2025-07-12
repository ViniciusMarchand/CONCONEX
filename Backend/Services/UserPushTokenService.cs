using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class UserPushTokenService(IUserPushTokenRepository repository, IAuthRepository authRepository) : IUserPushTokenService
{
    private readonly IUserPushTokenRepository _repository = repository;
    private readonly IAuthRepository _authRepository = authRepository;

    public async Task AddTokenAsync(string userId, string token)
    {
        var existingToken = await _repository.GetTokenByTokenAndUserIdAsync(token, userId);
        User user = await _authRepository.FindByIdAsync(userId);

        if (existingToken == null)
        {
            var userPushToken = new UserPushToken
            {
                UserId = userId,
                User = user,
                Token = token,
            };

            await _repository.AddTokenAsync(userPushToken);
        }
    }

    public async Task<List<UserPushToken>> GetTokensByUserIdAsync(string userId)
    {
        return await _repository.GetTokensByUserIdAsync(userId);
    }

    public async Task RemoveTokenAsync(string token)
    {
        var existingToken = await _repository.GetTokenByTokenAsync(token); 
        if (existingToken != null)
        {
            await _repository.RemoveTokenAsync(existingToken);
        }
    }
}