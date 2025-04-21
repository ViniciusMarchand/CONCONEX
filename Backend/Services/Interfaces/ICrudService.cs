using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ICrudService<T, DTO> where T : class
{
    Task<T?> FindByIdAsync(Guid id);
    Task<IEnumerable<T>> FindAllAsync();
    Task<T> SaveAsync(DTO dto);
    Task<T> UpdateAsync(Guid id, DTO entity);
    Task DeleteAsync(Guid id);
}