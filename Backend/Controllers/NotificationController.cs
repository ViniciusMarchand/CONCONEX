using Backend.DTO;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/send-notification")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NotificationController(IPushNotificationService pushNotification) : ControllerBase
{
    private readonly IPushNotificationService _pushNotification = pushNotification;

    [HttpPost]
    public async Task<IActionResult> SendNofication([FromBody]  NotificationDTO dto)
    {
        await _pushNotification.SendPushNotificationAsync(dto.To, dto.Title, dto.Body);
        return Ok();
    }
}