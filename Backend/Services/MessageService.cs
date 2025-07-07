using Backend.DTO;
using Backend.Hubs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using Org.BouncyCastle.Asn1.Cms;

namespace Backend.Services;

public class MessageService(
    IMessageRepository messageRepository,
    IHttpContextService httpContextService,
    IAuthService authService,
    IHubContext<ChatHub> hubContext,
    IPushNotificationService pushNotificationService,
    S3Service s3Service

) : IMessageService
{
    private readonly IMessageRepository _messageRepository = messageRepository;
    private readonly IHttpContextService _httpContextService = httpContextService;
    private readonly IAuthService _authService = authService;
    private readonly IHubContext<ChatHub> _hubContext = hubContext;
    private readonly IPushNotificationService _notificationService = pushNotificationService;
    private readonly S3Service _s3Service = s3Service;


    public async Task<Message> CreateMessageAsync(MessageDTO dto)
    {
        string userId = _httpContextService.FindUserId();
        UserResponseDTO user = await _authService.UserInfo();

        string url  = await _s3Service.SaveAttachmentsAsync(dto);

        var message = new Message
        {
            Id = ObjectId.GenerateNewId(),
            ProjectId = dto.ProjectId,
            UserId = Guid.Parse(userId),
            Content = dto.Content!,
            UserFirstName = user.FirstName,
            UserLastName = user.LastName,
            SentAt = DateTime.UtcNow
        };


        if (dto.Attachment != null)
        {
            message.Attachments = new List<Attachment>
                {
                    new ()
                    {
                        Url = url,
                        Type = dto.Attachment.ContentType
                    }
                };
        }

        string? receiverId = await _authService.FindAnotherUserIdFromProject(dto.ProjectId, userId);

        await _messageRepository.CreateAsync(message);


        if (receiverId != null)
        {
            await _hubContext.Clients.Group(receiverId).SendAsync("ReceiveMessage", message);
            Console.WriteLine($"Message sent to user {userId}");
            await _notificationService.SendPushNotificationAsync(receiverId, $"{message.UserFirstName} {message.UserFirstName}", message.Content);
        }

        return message;
    }

    public async Task<List<Message>> GetMessagesByChatIdAsync(Guid projectId)
    {
        return await _messageRepository.GetByChatIdAsync(projectId);
    }

    public async Task<Message?> GetMessageByIdAsync(string id)
    {
        return await _messageRepository.GetByIdAsync(id);
    }

    public async Task UpdateMessageAsync(string id, Message updated)
    {
        await _messageRepository.UpdateAsync(id, updated);
    }

    public async Task DeleteMessageAsync(string id)
    {
        await _messageRepository.DeleteAsync(id);
    }

    public async Task<List<Message>> GetMessagesByProjectIdPagedAsync(Guid projectId, int page, int pageSize)
    {
        var mensagens = await _messageRepository.GetByProjectIdPagedAsync(projectId, page, pageSize);
        return mensagens;
    }
    
    public async Task ReadMessagesFromChat(Guid projectId)
    {
        string userId = _authService.FindUserIdByClaims();
        await _messageRepository.ReadMessagesFromChat(projectId, userId);
    }
}
