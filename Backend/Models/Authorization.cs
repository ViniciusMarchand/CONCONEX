using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.Models;

public class Authorization : BaseEntity
{
    public Guid Id { get; set; }
    public Roles Role { get; set; }


    [JsonIgnore]
    public User User { get; set; } = new();
    public string UserId { get; set; } = string.Empty;

    [JsonIgnore]
    public Project Project { get; set; } = new();
    public Guid ProjectId { get; set; }
}