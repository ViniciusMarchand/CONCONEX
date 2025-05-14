using System.Security.Claims;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class HttpContextService(IHttpContextAccessor httpContextAccessor) : IHttpContextService
{
    readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string FindUserId() 
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("User not authenticated");
    }
}