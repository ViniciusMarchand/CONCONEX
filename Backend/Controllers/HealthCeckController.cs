using Backend.Repositories;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController(ILogger<HealthCheckController> logger, IVerificationCodeService verificationCodesService) : ControllerBase
{
    private readonly ILogger<HealthCheckController> _logger = logger;
    private readonly IVerificationCodeService _verificationCodesService = verificationCodesService;

    [HttpGet]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult Get()
    {
        _logger.LogInformation("Health check request received");
        return Ok("Healthy");
    }

    [HttpGet("mongo-db-health")]
    public async Task<IActionResult> GetMongoDbHealth()
    {
        try
        {
            await _verificationCodesService.GenerateVerificationCode("testeeeeee@gmail.com");
            return Ok("SALVO");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MongoDB health check failed");
            return StatusCode(500, "MongoDB is not healthy");
        }
    }
}
