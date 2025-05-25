using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.DTO;
using Backend.Repositories.Interfaces;
using Backend.Exceptions;
using Backend.Infrastructure;

namespace Backend.Repositories;

public class AuthRepository(ApplicationDbContext context) : IAuthRepository
{
    readonly ApplicationDbContext _context = context;


    public async Task<User> FindUserByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email) ?? throw new EntityNotFoundException("User not found.");
    }

    public async Task<User> FindByUsername(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username) ?? throw new EntityNotFoundException("User not found.");
    }


    public async Task<User> Login(UserLoginDTO dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email) ?? throw new KeyNotFoundException("Invalid email or password.");

        return user;
    }

    public async Task<User> Register(User user)
    {
        try
        {
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }
        catch (DbUpdateException e)
        {
            var innerMessage = e.InnerException?.Message ?? string.Empty;

            if (innerMessage.Contains("Username") || innerMessage.Contains("IX_Users_Username"))
            {
                throw new Exception("Username unavailable.");
            }
            else if (innerMessage.Contains("Email") || innerMessage.Contains("IX_Users_Email"))
            {
                throw new Exception("Email unavailable.");
            }

            throw new Exception($"Erro ao criar usuário. Detalhes: {innerMessage}");
        }
    }



    public async Task Delete(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task Update(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task CreateAuthorizationAsync(Authorization authorization)
    {
        await _context.Authorizations.AddAsync(authorization);
        await _context.SaveChangesAsync();
    }

    public async Task<UserResponseDTO> UserInfo(string id)
    {
        return await _context.Users.Where(u => u.Id == id).Select(u => new UserResponseDTO
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email!,
            PhoneNumber = u.PhoneNumber!,
            Username = u.Username
        }).FirstOrDefaultAsync() ?? throw new EntityNotFoundException("User not found.");
    }

    public async Task<string?> FindAnotherUserIdFromProject(Guid projectId, string userId)
    {
        return await _context.Authorizations
            .Where(a => a.ProjectId == projectId && a.UserId != userId)
            .Select(a => a.UserId)
            .FirstOrDefaultAsync();
    }

    public async Task<User> FindByIdAsync(string id)
    {
        return await _context.Users.FindAsync(id) ?? throw new EntityNotFoundException("User not found.");
    }
}