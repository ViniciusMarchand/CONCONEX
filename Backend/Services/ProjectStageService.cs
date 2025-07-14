using Backend.DTO;
using Backend.Enums;
using Backend.Exceptions;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Org.BouncyCastle.Crypto.Engines;

namespace Backend.Services;

public class ProjectStageService(
    IProjectStageRepository projectStageRepository,
    IAuthService authService,
    IProjectRepository projectRepository,
    S3Service s3Service,
    IPushNotificationService pushNotificationService
) 
: IProjectStageService
{

    private readonly IProjectStageRepository _projectStageRepository = projectStageRepository;
    private readonly IAuthService _authService = authService;
    private readonly IProjectRepository _projectRepository = projectRepository;
    private readonly S3Service _s3Service = s3Service;
    private readonly IPushNotificationService _pushNotificationService = pushNotificationService;

    public async Task<IEnumerable<ProjectStage>> FindAllAsync()
    {
        return await _projectStageRepository.FindAllAsync();
    }

    public async Task<IEnumerable<ProjectStageResponseDTO>> FindByProjectIdAsync(Guid projectId)
    {
        return await _projectStageRepository.FindByProjectIdAsync(projectId);
    }

    public async Task<ProjectStage?> FindByIdAsync(Guid id)
    {
        return await _projectStageRepository.FindByIdAsync(id);
    }

    public async Task<ProjectStage> SaveAsync(ProjectStageDTO dto)
    {

        Project project = await _projectRepository.FindByIdAsync(dto.ProjectId) ?? throw new EntityNotFoundException("Project not found.");

        ProjectStage projectStage = new()
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Project = project,
            Deadline = dto.Deadline
        };

        return await _projectStageRepository.AddAsync(projectStage);
    }

    public async Task<ProjectStage> UpdateAsync(Guid id, ProjectStageDTO dto)
    {
        ProjectStage? projectStage = await _projectStageRepository.FindByIdAsync(id) ?? throw new EntityNotFoundException("ProjectStage not found");
        Project project = await _projectRepository.FindByIdAsync(dto.ProjectId) ?? throw new EntityNotFoundException("Project not found.");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to update this project"); ;

        projectStage.Title = dto.Title;
        projectStage.Description = dto.Description;
        projectStage.Status = dto.Status;
        projectStage.Deadline = dto.Deadline;

        string? receiverId = await _authService.FindAnotherUserIdFromProject(id, userId);

        if (receiverId != null)
        {
            await _pushNotificationService.SendPushNotificationAsync(receiverId, $"{project.Title}", $"Etapa {dto.Title} atualizada!");
        }

        return await _projectStageRepository.UpdateAsync(projectStage);
    }

    public async Task DeleteAsync(Guid id)
    {
        ProjectStage projectStage = _projectStageRepository.FindByIdAsync(id).Result ?? throw new EntityNotFoundException("ProjectStage not found");
        Project project = await _projectRepository.FindByIdAsync(projectStage.ProjectId) ?? throw new EntityNotFoundException("Project not found.");

        string userId = _authService.FindUserIdByClaims();

        Authorization authorization = project.Authorizations.Where(a => a.UserId == userId && a.Role == Roles.Admin).FirstOrDefault() ?? throw new UnauthorizedAccessException("You are not authorized to update this project"); ;

        projectStage.IsDeleted = true;

        await _projectStageRepository.UpdateAsync(projectStage);
    }

    public async Task<Image> SaveImageAsync(ImageDTO dto)
    {
        ProjectStage projectStage = await _projectStageRepository.FindByIdAsync(dto.ProjectStageId) ?? throw new EntityNotFoundException("Project stage not found.");

        Guid novoId = Guid.NewGuid();

        string path = await _s3Service.AddProjectStageImage(dto.Image, projectStage.ProjectId, projectStage.Id, novoId);

        Image image = new()
        {
            Id = novoId,
            Path = path,
            ProjectStage = projectStage,
            FileExtension = Path.GetExtension(dto.Image.FileName)
        };

        return await _projectStageRepository.SaveImageAsync(image);
    }

    public async Task RemoveImageAsync(Guid id)
    {
        Image image = await _projectStageRepository.FindImageById(id) ?? throw new EntityNotFoundException("Image not found.");
        ProjectStage projectStage = await _projectStageRepository.FindByIdAsync(image.ProjectStageId)
        ?? throw new EntityNotFoundException("Project stage not found.");

        _ = await _s3Service.RemoveProjectStageImage(projectStage.ProjectId, projectStage.Id, image.Id, image.FileExtension);

        await _projectStageRepository.RemoveImageAsync(image);
    }


}
