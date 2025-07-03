using System.ComponentModel.DataAnnotations;
using Backend.DTO;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;


[ApiController]
[Route("api/calendar-configurations")]
public class CalendarConfigurationController(ICalendarConfigurationService calendarConfigurationService) : ControllerBase
{
    private readonly ICalendarConfigurationService _calendarConfigurationService = calendarConfigurationService;

    [HttpGet("{id}")]
    public async Task<ActionResult<CalendarConfiguration>> GetById([Required] Guid id)
    {
        CalendarConfiguration? configuration = await _calendarConfigurationService.FindByIdAsync(id);

        if (configuration == null)
        {
            return NotFound();
        }

        return Ok(configuration);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CalendarConfiguration>>> GetAll()
    {
        IEnumerable<CalendarConfiguration> configurations = await _calendarConfigurationService.FindAllAsync();
        return Ok(configurations);
    }

    [HttpPost]
    public async Task<ActionResult<CalendarConfiguration>> Create([FromBody] CalendarConfigurationDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        CalendarConfiguration createdConfiguration = await _calendarConfigurationService.SaveAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdConfiguration.Id }, createdConfiguration);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CalendarConfiguration>> Update(
        [Required] Guid id,
        [FromBody] CalendarConfigurationDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            CalendarConfiguration updatedConfiguration = await _calendarConfigurationService.UpdateAsync(id, dto);
            return Ok(updatedConfiguration);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([Required] Guid id)
    {
        try
        {
            await _calendarConfigurationService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("upsert")]
    public async Task<ActionResult<CalendarConfiguration>> Upsert(
        [FromBody] CalendarConfigurationDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            CalendarConfiguration result = await _calendarConfigurationService.UpsertAsync(dto);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<CalendarConfiguration?>> GetByUserId([Required] string userId)
    {
        CalendarConfiguration? configuration = await _calendarConfigurationService.FindByUserIdAsync(userId);

        if (configuration == null)
        {
            return NotFound();
        }

        return Ok(configuration);
    }

    
}