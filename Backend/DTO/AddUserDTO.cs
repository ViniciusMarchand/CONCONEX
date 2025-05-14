namespace Backend.DTO;


public class AddUserDTO
{
    public Guid ProjectId { get; set; }
    public string Username { get; set; } = string.Empty;
}