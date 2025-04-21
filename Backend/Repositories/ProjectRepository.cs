using Backend.Enums;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ProjectRepository(ApplicationDbContext context) : IProjectRepository
{

    private readonly ApplicationDbContext _context = context;

    public async Task<Project> AddAsync(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<IEnumerable<Project>> FindByAdminIdAsync(string adminId)
    {
        return await _context.Projects.Where(p => p.Authorizations.Any(a => a.UserId == adminId && a.Role == Roles.Admin)).Include(p => p.ProjectStages).ToListAsync();
    }

    public async Task<Project?> FindByIdAsync(Guid id)
    {
        return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> FindAllAsync()
    {
        return await _context.Projects.OrderByDescending(p => p.CreatedAt).Take(20).ToListAsync();
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync();
        return project;
    }
}