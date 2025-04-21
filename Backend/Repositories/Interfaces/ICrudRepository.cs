namespace Backend.Repositories.Interfaces;

public interface ICrudRepository<T> where T : class
{
    Task<T?> FindByIdAsync(Guid id);
    Task<IEnumerable<T>> FindAllAsync();
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
}