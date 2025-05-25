using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class UserPushTokenRepository(ApplicationDbContext context) : IUserPushTokenRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddTokenAsync(UserPushToken token)
    {
        _context.UserPushTokens.Add(token);
        await _context.SaveChangesAsync();
    }

    public async Task<UserPushToken?> GetTokenByTokenAsync(string token)
    {
        return await _context.UserPushTokens
            .FirstOrDefaultAsync(t => t.Token == token);
    }

    public async Task<UserPushToken?> GetTokenByTokenAndUserIdAsync(string token, string userId)
    {
        return await _context.UserPushTokens
            .FirstOrDefaultAsync(t => t.Token == token && t.UserId == userId);
    }

    public async Task<List<UserPushToken>> GetTokensByUserIdAsync(string userId)
    {
        return await _context.UserPushTokens
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }

    public async Task RemoveTokenAsync(UserPushToken token)
    {
        _context.UserPushTokens.Remove(token);
        await _context.SaveChangesAsync();
    }
}