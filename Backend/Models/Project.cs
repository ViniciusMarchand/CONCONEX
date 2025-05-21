using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.Models;

public class Project : BaseEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Status Status { get; set; } = Status.Pending; 
    public DateTime Deadline { get; set; }
    public string Image { get; set; } = string.Empty;

    // [JsonIgnore]
    public ICollection<ProjectStage> ProjectStages { get; set; } = [];

    [JsonIgnore]
    public ICollection<Authorization> Authorizations { get; set; } = [];
}