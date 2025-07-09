using System.Security.Claims;
using Backend.DTO;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class ProjectService(
    IProjectRepository projectRepository,
    IUserRepository userRepository,
    IAuthService authService,
    S3Service s3Service,
    IMessageRepository messageRepository,
    IPushNotificationService pushNotificationService
) : IProjectService
{

    private readonly IProjectRepository _projectRepository = projectRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IAuthService _authService = authService;
    private readonly S3Service _s3Service = s3Service;
    private readonly IMessageRepository _messageRepository = messageRepository;
        private readonly IPushNotificationService _notificationService = pushNotificationService;


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

        Guid projectId = Guid.NewGuid();
        Project newProject = new()
        {
            Id = projectId,
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            Status = dto.Status,
        };

        if (dto.Image != null)
        {
            string path = await _s3Service.UploadProjectPictureAsync(dto.Image, projectId);
            newProject.Image = path;
        }

        Project project = await _projectRepository.AddAsync(newProject);

        Authorization authorization = new()
        {
            Project = project,
            User = user,
            Role = Roles.Admin
        };
        await _authService.CreateAuthorizationAsync(authorization);


        return project;
    }

    public async Task<Project> UpdateAsync(Guid id, ProjectDTO dto)
    {
        Project? project = await _projectRepository.FindByIdAsync(id) ?? throw new EntityNotFoundException("Project not found");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to update this project"); ;

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.Deadline = dto.Deadline;
        project.Status = dto.Status;

        if (dto.Image != null)
        {
            string path = await _s3Service.UploadProjectPictureAsync(dto.Image, project.Id);
            project.Image = path;
        }

        string? receiverId = await _authService.FindAnotherUserIdFromProject(id, userId);

        if (receiverId != null)
        {
            await _notificationService.SendPushNotificationAsync(receiverId, $"{project.Title}", "Status do projeto atualizado!");
        }

        return await _projectRepository.UpdateAsync(project);
    }

    public Task DeleteAsync(Guid id)
    {
        Project project = _projectRepository.FindByIdAsync(id).Result ?? throw new EntityNotFoundException("Project not found");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin && project.Id == a.ProjectId).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to delete this project");

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
        bool isUserInProject = await _projectRepository.IsUserInProject(user.Id, projectId);

        if (isUserInProject)
            throw new ClientIsAlreadyAddedException("User is already added.");

        Authorization authorization = new()
        {
            Project = project,
            User = user,
            Role = Roles.Client
        };

        await _authService.CreateAuthorizationAsync(authorization);
    }

    public async Task<List<ProjectChatDTO>> FindChats()
    {
        string userId = _authService.FindUserIdByClaims();

        List<ProjectChatDTO> projectsChatDto = await _projectRepository.FindChats(userId);

        foreach (ProjectChatDTO pc in projectsChatDto)
        {
            pc.LastMessage = await _messageRepository.GetLastMessage(pc.ProjectId);
            pc.UnreadMessages = await _messageRepository.GetUnreadMessagesQuantityAsync(pc.ProjectId, userId);
        }

        return projectsChatDto;
    }

    public async Task RemoveUserFromProjectAsync(Guid projectId, string userId)
    {
        string currentUserId = _authService.FindUserIdByClaims();
        Project project = await _projectRepository.FindByIdAsync(projectId) ?? throw new EntityNotFoundException("Project not found");

        Authorization authorization = project.Authorizations
            .FirstOrDefault(a => a.UserId == currentUserId && a.Role == Roles.Admin && a.ProjectId == projectId)
            ?? throw new UnauthorizedAccessException("You are not authorized to remove users from this project");

        await _projectRepository.RemoveUserFromProjectAsync(projectId, userId);
    }
    
    public async Task<ProjectResponseDTO> FindProjectInfoAsync(Guid id)
    {
        string userId = _authService.FindUserIdByClaims();
        bool isUserInProject = await _projectRepository.IsUserInProject(userId, id);

        if (!isUserInProject)
        {
            throw new UnauthorizedAccessException("You are not authorized to view this project");
        }

        return await _projectRepository.FindProjectInfoAsync(id, userId);
    }
}