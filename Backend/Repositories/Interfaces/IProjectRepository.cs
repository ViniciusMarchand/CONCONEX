using Backend.DTO;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectRepository : ICrudRepository<Project>
{
    Task<IEnumerable<ProjectResponseDTO>> FindByAdminIdAsync(string adminId);
    Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync(string userId);
}