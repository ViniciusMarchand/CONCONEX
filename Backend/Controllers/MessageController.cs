using Backend.DTO;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/message")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class MessageController(
    IProjectService projectService,
    IMessageService messageService
) : ControllerBase
{
    private readonly IMessageService _messageService = messageService;
    private readonly IProjectService _projectService = projectService;

    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage([FromBody] MessageDTO dto)
    {
        var message = await _messageService.CreateMessageAsync(dto);
        return CreatedAtAction(nameof(GetMessageById), new { id = message.Id.ToString() }, message);
    }

    [HttpGet("chat/{projectId}")]
    public async Task<ActionResult<List<Message>>> GetMessagesByProjectId(Guid projectId)
    {
        var messages = await _messageService.GetMessagesByChatIdAsync(projectId);
        return Ok(messages);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Message>> GetMessageById(string id)
    {
        var message = await _messageService.GetMessageByIdAsync(id);
        if (message == null)
            return NotFound();

        return Ok(message);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> UpdateMessage(string id, [FromBody] Message updated)
    {
        var existing = await _messageService.GetMessageByIdAsync(id);
        if (existing == null)
            return NotFound();

        updated.Id = existing.Id;
        await _messageService.UpdateMessageAsync(id, updated);
        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> DeleteMessage(string id)
    {
        var existing = await _messageService.GetMessageByIdAsync(id);
        if (existing == null)
            return NotFound();

        await _messageService.DeleteMessageAsync(id);
        return NoContent();
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<List<Message>>> GetMessagesByChatIdPaged(
        Guid projectId,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var messages = await _messageService.GetMessagesByProjectIdPagedAsync(projectId, page, limit);
        return Ok(messages);
    }


    [HttpGet("chats")]
    public async Task<ActionResult<List<ProjectChatDTO>>> FindChats()
    {
        return await _projectService.FindChats();
    }

    [HttpGet("read/{projectId}")]
    public async Task<ActionResult> ReadMessages(Guid projectId)
    {
        await _messageService.ReadMessagesFromChat(projectId);
        return Ok();
    }
   
}