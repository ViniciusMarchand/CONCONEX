using Backend.DTO;
using Backend.Enums;
using Backend.Exceptions;
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
            .Any(a => a.UserId == adminId && a.Role == Roles.Admin) && !p.IsDeleted)
            .OrderBy(p => p.Title)
            .Select(p => new ProjectResponseDTO()
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Status = p.Status.ToString(),
                Deadline = p.Deadline,
                AdminId = p.Authorizations.Where(a => a.Role == Roles.Admin).Select(a => a.UserId).FirstOrDefault(),
                Image = p.Image,
            })
            .ToListAsync();

        foreach (ProjectResponseDTO project in projects)
        {
            var admin = _context.Authorizations.Where(a => a.ProjectId == project.Id && a.Role == Roles.Client).Select(a => new UserInfoDTO
            {
                FirstName = a.User.FirstName,
                LastName = a.User.LastName,
                UserId = a.UserId
            })
            .FirstOrDefault();

            if (admin != null)
            {
                project.UserInfo = admin;
            }
        }
        return projects;
    }

    public async Task<Project?> FindByIdAsync(Guid id)
    {
        return await _context.Projects.Include(p => p.Authorizations).FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<ProjectResponseDTO> FindProjectInfoAsync(Guid id, string currentUser)
    {
        ProjectResponseDTO project = await _context.Projects.Select(p => new ProjectResponseDTO()
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            Status = p.Status.ToString(),
            Deadline = p.Deadline,
            AdminId = p.Authorizations.Where(a => a.Role == Roles.Admin).Select(a => a.UserId).FirstOrDefault(),

            Image = p.Image,
        }).FirstOrDefaultAsync(p => p.Id == id) ?? throw new EntityNotFoundException("Project not found.");


        UserInfoDTO? otherUser = _context.Authorizations.Where(a => a.ProjectId == project.Id && a.UserId != currentUser ).Select(a => new UserInfoDTO
        {
            FirstName = a.User.FirstName,
            LastName = a.User.LastName,
            UserId = a.UserId
        })
           .FirstOrDefault();


        if (otherUser != null)
        {
            project.UserInfo = otherUser;
        }

        return project;
    }

    public async Task<IEnumerable<Project>> FindAllAsync()
    {
        return await _context.Projects.OrderByDescending(p => p.CreatedAt).Take(20).ToListAsync();
    }

    public async Task<bool> IsUserInProject(string userId, Guid projectId)
    {
        Authorization? authorization = await _context.Authorizations.Where(a => a.ProjectId == projectId && a.UserId == userId).FirstOrDefaultAsync();

        if (authorization == null)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync(string userId)
    {
        IEnumerable<ProjectResponseDTO> projects = await _context.Projects
            .Where(p => p.Authorizations
            .Any(a => a.UserId == userId && a.Role == Roles.Client) && !p.IsDeleted)
            .OrderBy(p => p.Title)
            .Select(p => new ProjectResponseDTO()
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Status = p.Status.ToString(),
                Deadline = p.Deadline,
                Image = p.Image,
            })
            .ToListAsync();

        foreach (ProjectResponseDTO project in projects)
        {
            var admin = _context.Authorizations.Where(a => a.ProjectId == project.Id && a.Role == Roles.Admin).Select(a => new UserInfoDTO
            {
                FirstName = a.User.FirstName,
                LastName = a.User.LastName,
                UserId = a.UserId
            })
            .FirstOrDefault();

            if (admin != null)
            {
                project.UserInfo = admin;
            }
        }

        return projects;
    }

    public async Task<List<ProjectChatDTO>> FindChats(string userId)
    {
        return await _context.Projects.Where(p => !p.IsDeleted && p.Authorizations.Any(a => a.UserId == userId)).Select(p => new ProjectChatDTO
        {
            ProjectId = p.Id,
            ProjectImage = p.Image,
            Status = p.Status.ToString(),
            ProjectTitle = p.Title,
            IsAdmin = p.Authorizations.Any(a => a.UserId == userId && a.Role == Roles.Admin),
            UnreadMessages = 0,
            LastMessage = null
        }).AsNoTracking().ToListAsync();
    }

    public async Task RemoveUserFromProjectAsync(Guid projectId, string userId)
    {
        var authorization = await _context.Authorizations
            .FirstOrDefaultAsync(a => a.ProjectId == projectId && a.UserId == userId) ?? throw new EntityNotFoundException("Authorization not found.");
        _context.Authorizations.Remove(authorization);
        await _context.SaveChangesAsync();
    }
}