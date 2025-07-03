using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class CalendarConfiguration
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;

    [InverseProperty(nameof(User.CalendarConfiguration))]
    public virtual User User { get; set; } = null!;

    public string EmailGoogle { get; set; } = string.Empty;

    public List<ScheduleException> Exceptions { get; set; } = [];
    public List<AvailablePeriod> Periods { get; set; } = [];
    public bool IsActive { get; set; }
}