using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectService : ICrudService<Project, ProjectDTO>
{
    Task<IEnumerable<ProjectResponseDTO>> FindByAdminIdAsync();
    Task<IEnumerable<ProjectResponseDTO>> FindByUserIdAsync();
    Task AddUserToProject(Guid projectId, string username);
    Task<List<ProjectChatDTO>> FindChats();
}