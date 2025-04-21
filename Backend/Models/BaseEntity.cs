namespace Backend.Models;

public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set;}
}