
using Backend.Config;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
namespace Backend.Repositories.Interfaces;

public interface IMessageRepository
{
    Task CreateAsync(Message message);
    Task<List<Message>> GetByChatIdAsync(Guid projectId);
    Task<Message?> GetByIdAsync(string id);
    Task UpdateAsync(string id, Message updatedMessage);
    Task DeleteAsync(string id);
    Task<List<Message>> GetByProjectIdPagedAsync(Guid projectId, int page, int pageSize);
    Task<Message> GetLastMessage(Guid projectId);
    Task<int> GetUnreadMessagesQuantityAsync(Guid projectId, string userId);
    Task ReadMessagesFromChat(Guid chatId, string currentUserId);
}