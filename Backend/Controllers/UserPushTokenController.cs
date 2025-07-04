using Amazon.S3;
using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/user-push-token")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserPushTokenController(IUserPushTokenService tokenService) : ControllerBase
{
    private readonly IUserPushTokenService _tokenService = tokenService;


    [HttpPost]
    public async Task<IActionResult> RegisterToken([FromBody] RegisterTokenRequestDTO request)
    {
        await _tokenService.AddTokenAsync(request.UserId, request.Token);
        return Ok();
    }

    [HttpDelete("{token}")]
    public async Task<IActionResult> RemoveToken(string token)
    {
        await _tokenService.RemoveTokenAsync(token);
        return Ok();
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetTokens(string userId)
    {
        var tokens = await _tokenService.GetTokensByUserIdAsync(userId);
        return Ok(tokens);
    }
   
}