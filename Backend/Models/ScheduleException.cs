using Newtonsoft.Json;

namespace Backend.Models;

public class ScheduleException
{
    public Guid Id { get; set; }
    public Guid CalendarConfigurationId { get; set; }
    [JsonIgnore]
    public CalendarConfiguration CalendarConfiguration { get; set; } = new();
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}
