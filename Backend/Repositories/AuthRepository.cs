using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Backend.DTO;
using Backend.Repositories.Interfaces;
using Backend.Exceptions;

namespace Backend.Repositories;

public class AuthRepository(ApplicationDbContext context) : IAuthRepository
{
    readonly ApplicationDbContext _context = context;


    public async Task<User> FindUserByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email) ?? throw new EntityNotFoundException("Usuário não encontrado");
    }

    public async Task<User> Login(UserLoginDTO dto) 
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username) ?? throw new KeyNotFoundException("Usuário não encontrado ou senha inválida");
        
        return user;
    }

    public async Task<User> Register(User user)
    {
        try
        {
            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return user;
        } 
        catch (DbUpdateException e)
        {
            var message = e.InnerException?.Message ?? string.Empty;
            if (message.Contains("IX_Users_Username"))
            {
                throw new Exception("Username unavailable");
            }
            else if (message.Contains("IX_Users_Email"))
            {
                throw new Exception("Email unavailable");
            }

            throw new Exception("Erro ao criar usuário.");
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
}