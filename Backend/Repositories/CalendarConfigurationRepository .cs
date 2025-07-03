using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class CalendarConfigurationRepository(ApplicationDbContext context) : ICalendarConfigurationRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<CalendarConfiguration?> FindByIdAsync(Guid id)
    {
        return await _context.CalendarConfigurations
            .Include(c => c.Exceptions)
            .Include(c => c.Periods)
            .Include(c => c.User)
            .AsTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<CalendarConfiguration>> FindAllAsync()
    {
        return await _context.CalendarConfigurations
            .Include(c => c.Exceptions)
            .Include(c => c.Periods)
            .ToListAsync();
    }

    public async Task<CalendarConfiguration> AddAsync(CalendarConfiguration entity)
    {
        _context.CalendarConfigurations.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<CalendarConfiguration> UpdateAsync(CalendarConfiguration entity)
    {
        Console.WriteLine($"Updating CalendarConfiguration with ID: {entity.UserId}");
        _context.CalendarConfigurations.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public Task<CalendarConfiguration?> FindByUserIdAsync(string userId)
    {
        return _context.CalendarConfigurations
            .Include(c => c.Exceptions)
            .Include(c => c.Periods)
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task RemoveExceptionAsync(List<ScheduleException> list)
    {
        foreach (var item in list)
        {
            var exception = await _context.ScheduleExceptions.FindAsync(item.Id);
            if (exception != null)
            {
                _context.ScheduleExceptions.Remove(exception);
            }
        }

        // await _context.SaveChangesAsync();
    }

    public async Task RemovePeriodAsync(List<AvailablePeriod> list)
    {

        foreach (var item in list)
        {
            var exception = await _context.AvailablePeriods.FindAsync(item.Id);
            if (exception != null)
            {
                _context.AvailablePeriods.Remove(exception);
            }
        }
    }

    public async Task AddPeriodAsync(List<AvailablePeriod> list)
    {

        if (list == null || list.Count == 0)
            return;

        await _context.AvailablePeriods.AddRangeAsync(list);

        await _context.SaveChangesAsync();
        Console.WriteLine($"Added {list.Count} available periods.");

    }

    public async Task AddExceptionAsync(List<ScheduleException> list)
    {

        if (list == null || list.Count == 0)
            return;

        await _context.ScheduleExceptions.AddRangeAsync(list);
        
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

}
