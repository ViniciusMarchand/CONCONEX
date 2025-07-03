using Backend.Models;
using Backend.DTO;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class CalendarConfigurationService(ICalendarConfigurationRepository repository) : ICalendarConfigurationService
{
    private readonly ICalendarConfigurationRepository _repository = repository;

    public async Task<CalendarConfiguration?> FindByIdAsync(Guid id)
    {
        return await _repository.FindByIdAsync(id);
    }

    public async Task<IEnumerable<CalendarConfiguration>> FindAllAsync()
    {
        return await _repository.FindAllAsync();
    }

    public async Task<CalendarConfiguration> SaveAsync(CalendarConfigurationDTO dto)
    {
        CalendarConfiguration entity = new()
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            EmailGoogle = dto.EmailGoogle,
            IsActive = dto.IsActive,
            Exceptions = dto.Exceptions?.Select(e => new ScheduleException
            {
                Id = Guid.NewGuid(),
                Start = e.Start,
                End = e.End
            }).ToList() ?? [],
            Periods = dto.Periods?.Select(p => new AvailablePeriod
            {
                Id = Guid.NewGuid(),
                Start = p.Start,
                DayOfWeek = p.DayOfWeek
            }).ToList() ?? []
        };

        return await _repository.AddAsync(entity);
    }

    public async Task<CalendarConfiguration> UpdateAsync(Guid id, CalendarConfigurationDTO dto)
    {
        CalendarConfiguration entity = await _repository.FindByIdAsync(id)
            ?? throw new Exception("Calendar configuration not found");

        Console.WriteLine($"CHEGOU AQUI");

        entity.IsActive = dto.IsActive;
        entity.EmailGoogle = dto.EmailGoogle;

        await _repository.SaveChangesAsync();

        List<ScheduleException> newExceptions = [.. dto.Exceptions
         .Select(e => new ScheduleException
         {
             Start = e.Start,
             End = e.End,
             CalendarConfigurationId = entity.Id
         })];

        List<AvailablePeriod> newPeriods = dto.Periods
            .Select(p => new AvailablePeriod
            {
                Start = p.Start,
                DayOfWeek = p.DayOfWeek,
                CalendarConfigurationId = entity.Id,
                CalendarConfiguration = null
            }).ToList();

        await _repository.RemoveExceptionAsync(entity.Exceptions);
        await _repository.AddExceptionAsync(newExceptions);
        await _repository.RemovePeriodAsync(entity.Periods);
        await _repository.AddPeriodAsync(newPeriods);

        Console.WriteLine($"Count new Prdios: {newPeriods.Count}");

        await _repository.SaveChangesAsync();

        return entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        CalendarConfiguration entity = await _repository.FindByIdAsync(id)
            ?? throw new Exception("Calendar configuration not found");

        entity.IsActive = false;
        await _repository.UpdateAsync(entity);
    }


    public async Task<CalendarConfiguration> UpsertAsync(CalendarConfigurationDTO dto)
    {
        CalendarConfiguration? existing = await _repository.FindByUserIdAsync(dto.UserId);

        if (existing == null)
        {
            return await SaveAsync(dto);
        }

        return await UpdateAsync(existing.Id, dto);
    }
    
    public async Task<CalendarConfiguration?> FindByUserIdAsync(string userId)
    {
        return await _repository.FindByUserIdAsync(userId);
    }
    
    
}