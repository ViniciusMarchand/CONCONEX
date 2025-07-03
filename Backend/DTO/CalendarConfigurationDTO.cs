namespace Backend.DTO;

public class CalendarConfigurationDTO
{
    public string UserId { get; set; } = string.Empty;
    public string EmailGoogle { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public List<ScheduleExceptionDTO> Exceptions { get; set; } = [];
    public List<AvailablePeriodDTO> Periods { get; set; } = [];
}