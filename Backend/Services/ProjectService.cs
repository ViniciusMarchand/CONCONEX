using System.Security.Claims;
using Backend.DTO;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class ProjectService(IProjectRepository projectRepository, IUserRepository userRepository, IAuthService authService) : IProjectService
{

    private readonly IProjectRepository _projectRepository = projectRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IAuthService _authService = authService;

    public async Task<IEnumerable<Project>> FindAllAsync()
    {
        return await _projectRepository.FindAllAsync();
    }

    public async Task<IEnumerable<ProjectResponseDTO>> FindByAdminIdAsync()
    {
        string userId = _authService.FindUserIdByClaims();
        return await _projectRepository.FindByAdminIdAsync(userId);
    }

    public async Task<Project?> FindByIdAsync(Guid id)
    {
        return await _projectRepository.FindByIdAsync(id);
    }

    public async Task<Project> SaveAsync(ProjectDTO dto)
    {
        string userId = _authService.FindUserIdByClaims();
        
        User user = await _userRepository.FindByIdAsync(userId) ?? throw new EntityNotFoundException("User not found");


        Project newProject = new()
        {
            Title = dto.Title,
            Description = dto.Description,     
            Deadline = dto.Deadline,       
            Status = dto.Status
        };


        Project project = await _projectRepository.AddAsync(newProject);

        Authorization authorization = new()
        {
            Project = project,
            User  = user,
            Role = Roles.Admin
        };

        await _authService.CreateAuthorizationAsync(authorization);
        return project;
    }

    public async Task<Project> UpdateAsync(Guid id, ProjectDTO dto)
    {
        Project? project = await _projectRepository.FindByIdAsync(id) ?? throw new EntityNotFoundException("Project not found");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to update this project");;

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.Deadline = dto.Deadline;
        project.Status = dto.Status;

        return await _projectRepository.UpdateAsync(project);
    }

    public Task DeleteAsync(Guid id)
    {
        Project project = _projectRepository.FindByIdAsync(id).Result ?? throw new EntityNotFoundException("Project not found");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to update this project");

        project.IsDeleted = true;

        return _projectRepository.UpdateAsync(project);
    }

    public async Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync()
    {
        string userId = _authService.FindUserIdByClaims();
        return await _projectRepository.FindByUserIdAsync(userId);
    }

    public async Task AddUserToProject(Guid projectId, string username)
    {
        Project project = await _projectRepository.FindByIdAsync(projectId) ?? throw new EntityNotFoundException("Project not found");
        User user = await _authService.FindByUsername(username);

        Authorization authorization = new() {
            Project = project,
            User = user,
            Role = Roles.Client
        };

        await _authService.CreateAuthorizationAsync(authorization);
    } 
}