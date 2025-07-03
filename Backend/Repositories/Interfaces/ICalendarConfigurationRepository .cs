using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ICalendarConfigurationRepository : ICrudRepository<CalendarConfiguration>
{
    Task<CalendarConfiguration?> FindByUserIdAsync(string userId);
    Task RemoveExceptionAsync(List<ScheduleException> list);
    Task RemovePeriodAsync(List<AvailablePeriod> list);
    Task AddPeriodAsync(List<AvailablePeriod> list);
    Task AddExceptionAsync(List<ScheduleException> list);
    Task SaveChangesAsync();
}
