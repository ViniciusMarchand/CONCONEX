using Backend.DTO;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectRepository : ICrudRepository<Project>
{
    Task<IEnumerable<ProjectResponseDTO>> FindByAdminIdAsync(string adminId);
    Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync(string userId);
    Task<bool> IsUserInProject(string userId, Guid projectId);
    Task<List<ProjectChatDTO>> FindChats(string userId);
    Task RemoveUserFromProjectAsync(Guid projectId, string userId);
    Task<ProjectResponseDTO> FindProjectInfoAsync(Guid id, string currentUser);
}