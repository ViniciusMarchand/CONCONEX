using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectStageService : ICrudService<ProjectStage, ProjectStageDTO>
{
    Task<IEnumerable<ProjectStageResponseDTO>> FindByProjectIdAsync(Guid projectId);
}