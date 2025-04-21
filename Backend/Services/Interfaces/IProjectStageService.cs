using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectStageService : ICrudService<ProjectStage, ProjectStageDTO>
{
    Task<IEnumerable<ProjectStage>> FindByProjectIdAsync(Guid projectId);
}