using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IUserPushTokenRepository
{
    Task AddTokenAsync(UserPushToken token);
    Task<UserPushToken?> GetTokenByTokenAsync(string token);
    Task<List<UserPushToken>> GetTokensByUserIdAsync(string userId);
    Task RemoveTokenAsync(UserPushToken token);
    Task<UserPushToken?> GetTokenByTokenAndUserIdAsync(string token, string userId);
}