using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.DTO;

public class ProjectDTO
{

    [Required]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; } = DateTime.Now; 

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Status Status { get; set; } = Status.Pending;

}