using Backend.Models;
using Backend.DTO;

namespace Backend.Services.Interfaces;

public interface ICalendarConfigurationService : ICrudService<CalendarConfiguration, CalendarConfigurationDTO>
{
    Task<CalendarConfiguration> UpsertAsync(CalendarConfigurationDTO dto);
    Task<CalendarConfiguration?> FindByUserIdAsync(string userId);
}
