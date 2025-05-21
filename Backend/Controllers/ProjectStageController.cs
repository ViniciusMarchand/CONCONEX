using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/project-stage")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ProjectStageController(IProjectStageService projectStageService) : ControllerBase
{
    private readonly IProjectStageService _projectStageService = projectStageService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectStage>>> GetAll()
    {
        IEnumerable<ProjectStage> projects = await _projectStageService.FindAllAsync();
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectStage>> GetById(Guid id)
    {
        ProjectStage? project = await _projectStageService.FindByIdAsync(id);

        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectStage>> Create([FromBody] ProjectStageDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        ProjectStage createdProject = await _projectStageService.SaveAsync(dto);
        return Ok(createdProject);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] ProjectStageDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        ProjectStage project = await _projectStageService.UpdateAsync(id, dto);
        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task Delete(Guid id)
    {
        await _projectStageService.DeleteAsync(id);
        Ok("ProjectStage removed.");
    }

    [HttpGet("project/{id}")]
    public async Task<ActionResult<IEnumerable<ProjectStageResponseDTO>>> GetProjectsByAdminId(Guid id)
    {
        IEnumerable<ProjectStageResponseDTO> projects = await _projectStageService.FindByProjectIdAsync(id);

        return Ok(projects);
    }


    [HttpDelete("image/{id}")]
    public async Task DeleteImage(Guid id)
    {
        await _projectStageService.RemoveImageAsync(id);
        Ok("Image removed.");
    }
    
    [HttpPost("image")]
    public async Task<ActionResult<Image>> CreateImage([FromForm] ImageDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Image image = await _projectStageService.SaveImageAsync(dto);
        return Ok(image);
    }
}