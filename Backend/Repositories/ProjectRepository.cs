using Backend.DTO;
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

    public async Task<IEnumerable<ProjectResponseDTO>> FindByAdminIdAsync(string adminId)
    {
        IEnumerable<ProjectResponseDTO> projects = await _context.Projects
            .Where(p => p.Authorizations
            .Any(a => a.UserId == adminId && a.Role == Roles.Admin))
            .Select(p => new ProjectResponseDTO() {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Status = p.Status.ToString(),
                Deadline = p.Deadline,
            })
            .ToListAsync();

        foreach(ProjectResponseDTO project in projects)
        {
            var admin = _context.Authorizations.Where(a => a.ProjectId == project.Id && a.Role == Roles.Client).Select(a => new UserInfoDTO
            {
                FirstName = a.User.FirstName,
                LastName = a.User.LastName,
            })
            .FirstOrDefault();

            if (admin != null)
            {
                project.AdminName = admin;
            }
        }
        return projects;
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

    public async Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync(string userId) {
        IEnumerable<ProjectResponseDTO> projects = await _context.Projects
            .Where(p => p.Authorizations
            .Any(a => a.UserId == userId && a.Role == Roles.Client))
            .Select(p => new ProjectResponseDTO() {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Status = p.Status.ToString(),
                Deadline = p.Deadline,
            })
            .ToListAsync();

        foreach(ProjectResponseDTO project in projects)
        {
            var admin = _context.Authorizations.Where(a => a.ProjectId == project.Id && a.Role == Roles.Admin).Select(a => new UserInfoDTO
            {
                FirstName = a.User.FirstName,
                LastName = a.User.LastName,
            })
            .FirstOrDefault();

            if (admin != null)
            {
                project.AdminName = admin;
            }
        }

        return projects;
    }
}