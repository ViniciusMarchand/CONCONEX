using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectStageRepository : ICrudRepository<ProjectStage>
{
    Task<IEnumerable<ProjectStage>> FindByProjectIdAsync(Guid projectId);
}