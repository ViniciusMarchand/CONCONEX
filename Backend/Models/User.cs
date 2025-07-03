using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Backend.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Index(nameof(Username), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User : IdentityUser
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    [JsonIgnore]
    [InverseProperty(nameof(CalendarConfiguration.User))]
    public  CalendarConfiguration? CalendarConfiguration { get; set; } = new();

    [JsonIgnore]
    public ICollection<Authorization> Authorizations { get; set; } = [];

    [JsonIgnore]
    public ICollection<UserPushToken> UserPushTokens { get; set; } = [];


}
