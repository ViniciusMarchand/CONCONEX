using System.Text.Json.Serialization;

namespace Backend.DTO;

public class AvailablePeriodDTO
{
    public DateTime Start { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public DayOfWeek DayOfWeek { get; set; }
}