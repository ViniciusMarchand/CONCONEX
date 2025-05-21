using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectStageService : ICrudService<ProjectStage, ProjectStageDTO>
{
    Task<IEnumerable<ProjectStageResponseDTO>> FindByProjectIdAsync(Guid projectId);
    Task<Image> SaveImageAsync(ImageDTO dto);
    Task RemoveImageAsync(Guid id);
}