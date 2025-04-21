using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.DTO;

public class ProjectStageDTO
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Guid ProjectId { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Status Status { get; set; } = Status.Pending;

    public DateTime Deadline { get; set; }
}