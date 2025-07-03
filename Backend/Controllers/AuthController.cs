

using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController
(
    IAuthService authService,
    IEmailService emailService,
    IVerificationCodeService verificationCodeService
) : ControllerBase
{

    readonly IAuthService _authService = authService;
    readonly IEmailService _emailService = emailService;
    readonly IVerificationCodeService _verificationCodeService = verificationCodeService;


    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDTO>> Login(UserLoginDTO dto)
    {
        try
        {
            LoginResponseDTO token = await _authService.Login(dto);
            return Ok(token);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (UnauthorizedAccessException e)
        {
            return Unauthorized(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [HttpPost("register")]
    public async Task<ActionResult<LoginResponseDTO>> Register(UserDTO dto)
    {
        try
        {
            User user = await _authService.Register(dto);

            string code = await _verificationCodeService.GenerateVerificationCode(user.Email!);

            _ = Task.Run(() => _emailService.SendEmailAsync(user.Email!, "Código para a confirmação do email", code));

            return Ok("User registred");
        }
        catch (EmailIsAlreadyInUseException e)
        {
            return BadRequest(e.Message);
        }
        catch (UsernameIsAlreadyInUseException e)
        {
            return BadRequest(e.Message);
        }
        catch (InvalidEmailException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

    }

    [HttpGet("resend-verification-code/{email}")]
    public async Task<ActionResult> ResendVerificationCode(string email)
    {
        try
        {
            User user = await _authService.FindUserByEmail(email);

            string code = await _verificationCodeService.GenerateVerificationCode(user.Email!);

            _ = Task.Run(() => _emailService.SendEmailAsync(user.Email!, "Código para a confirmação do email", code));

            return Ok("Verification code resent.");
        }
        catch (EntityNotFoundException e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("validate-user")]
    public async Task<ActionResult> ValidateUser([FromBody] VerificationCodeRequestDTO dto)
    {
        try
        {
            bool isValid = await _verificationCodeService.IsValid(dto);

            if (isValid)
            {
                await _authService.ValidateUser(dto.Email);

                return Ok("User validated.");
            }
            else
            {
                return BadRequest("Verification code not found.");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("user-info")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<UserResponseDTO> UserInfo()
    {
        return await _authService.UserInfo();
    }
}

