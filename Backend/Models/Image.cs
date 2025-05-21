
using Newtonsoft.Json;

namespace Backend.Models;

public class Image : BaseEntity
{
    public Guid Id { get; set; }
    public string Path { get; set; } = string.Empty;
    public string FileExtension { get; set; } = string.Empty;

    public Guid ProjectStageId { get; set; }
    [JsonIgnore]
    public ProjectStage ProjectStage { get; set; } = new();

}