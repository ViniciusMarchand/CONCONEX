using Backend.DTO;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectStageRepository : ICrudRepository<ProjectStage>
{
    Task<IEnumerable<ProjectStageResponseDTO>> FindByProjectIdAsync(Guid projectId);
    Task<Image> SaveImageAsync(Image image);
    Task RemoveImageAsync(Image image);
    Task<Image?> FindImageById(Guid id);
}