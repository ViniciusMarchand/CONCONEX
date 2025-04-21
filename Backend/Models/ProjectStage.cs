using Backend.Enums;
using Newtonsoft.Json;

namespace Backend.Models
{
    public class ProjectStage : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Status Status { get; set; } = Status.Pending;
        public DateTime Deadline { get; set; }
        public int Order { get; set; }

        [JsonIgnore]
        public Project Project { get; set; } = new();
        public Guid ProjectId { get; set; }
        
    }
}