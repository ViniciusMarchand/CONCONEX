using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectRepository : ICrudRepository<Project>
{
    Task<IEnumerable<Project>> FindByAdminIdAsync(string adminId);
}