using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using System.Globalization;

namespace Backend.Infrastructure
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<IdentityUser>(options)
    {
        public new DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectStage> ProjectsStages { get; set; }
        public DbSet<Authorization> Authorizations { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<UserPushToken> UserPushTokens { get; set; }
        public DbSet<CalendarConfiguration> CalendarConfigurations { get; set; }
        public DbSet<ScheduleException> ScheduleExceptions { get; set; }
        public DbSet<AvailablePeriod> AvailablePeriods { get; set; }
    }

}
