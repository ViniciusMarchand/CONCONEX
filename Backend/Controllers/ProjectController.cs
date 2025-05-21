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

[Route("api/project")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ProjectController(IProjectService projectService, S3Service s3Service) : ControllerBase
{
    private readonly IProjectService _projectService = projectService;
    private readonly S3Service _s3Service = s3Service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetAll()
    {
        IEnumerable<Project> projects = await _projectService.FindAllAsync();
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetById(Guid id)
    {
        Project? project = await _projectService.FindByIdAsync(id);

        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<Project>> Create([FromForm] ProjectDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Project createdProject = await _projectService.SaveAsync(dto);
        return Ok(createdProject);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromForm] ProjectDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Project project = await _projectService.UpdateAsync(id, dto);
        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task Delete(Guid id)
    {
        await _projectService.DeleteAsync(id);
        Ok("Project removed.");
    }

    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<ProjectResponseDTO>>> GetProjectsByAdminId()
    {
        IEnumerable<ProjectResponseDTO> projects = await _projectService.FindByAdminIdAsync();
        return Ok(projects);
    }

    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<ProjectResponseDTO>>> GetProjectsByUserId()
    {
        IEnumerable<ProjectResponseDTO> projects = await _projectService.FindByUserIdAsync();
        return Ok(projects);
    }

    [HttpPost("add-user")]
    public async Task<ActionResult> AddUserToProject([FromBody] AddUserDTO dto)
    {
        try
        {
            await _projectService.AddUserToProject(dto.ProjectId, dto.Username);
            return Ok();
        }
        catch (EntityNotFoundException e)
        {
            return BadRequest(e.Message);
        }
        catch (ClientIsAlreadyAddedException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("imagem")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage([FromForm] ProjectDTO dto)
    {
        var file = dto.Image;
            try
        {
            var url = await _s3Service.UploadFileAsync(file);
            return Ok(new { url });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (AmazonS3Exception ex)
        {
            return StatusCode(500, $"Erro S3: {ex.Message}");
        }
    }
   
}