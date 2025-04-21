using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectService : ICrudService<Project, ProjectDTO>
{
    Task<IEnumerable<Project>> FindByAdminIdAsync();
}