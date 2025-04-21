using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{

    private readonly ApplicationDbContext _context = context;

    public async Task<User?> FindByIdAsync(string id)
    {
        return await _context.Users.FindAsync(id);
    }
}