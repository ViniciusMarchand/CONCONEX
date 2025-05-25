using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IUserPushTokenService
{
    Task AddTokenAsync(string userId, string token, string deviceInfo);
    Task<List<UserPushToken>> GetTokensByUserIdAsync(string userId);
    Task RemoveTokenAsync(string token);
}