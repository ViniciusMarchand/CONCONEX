using Backend.DTO;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IMessageService
{
    Task<Message> CreateMessageAsync(MessageDTO dto);
    Task<List<Message>> GetMessagesByChatIdAsync(Guid projectId);
    Task<Message?> GetMessageByIdAsync(string id);
    Task UpdateMessageAsync(string id, Message updated);
    Task DeleteMessageAsync(string id);
    Task<List<Message>> GetMessagesByProjectIdPagedAsync(Guid projectId, int page, int pageSize);
    Task ReadMessagesFromChat(Guid projectId);
}
