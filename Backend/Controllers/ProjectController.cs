using Backend.DTO;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/projects")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ProjectController(IProjectService projectService) : ControllerBase
{
    private readonly IProjectService _projectService = projectService;

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
    public async Task<ActionResult<Project>> Create([FromBody] ProjectDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Project createdProject = await _projectService.SaveAsync(dto);
        return Ok(createdProject);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] ProjectDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Project project  = await _projectService.UpdateAsync(id, dto);
        return Ok(project);
    }

    [HttpDelete]
    public async Task Delete(Guid id)
    {
        await _projectService.DeleteAsync(id);
        Ok("Project removed.");
    }

    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjectsByAdminId()
    {
        IEnumerable<Project> projects = await _projectService.FindByAdminIdAsync();

        return Ok(projects);
    }

   
}