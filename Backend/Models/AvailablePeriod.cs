using Newtonsoft.Json;

namespace Backend.Models;

public class AvailablePeriod
{
    public Guid Id { get; set; }
    public Guid CalendarConfigurationId { get; set; }
    [JsonIgnore]
    public CalendarConfiguration CalendarConfiguration { get; set; } = new();
    public DateTime Start { get; set; }
    [JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
    public DayOfWeek DayOfWeek { get; set; }
}