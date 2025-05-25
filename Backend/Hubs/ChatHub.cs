using Microsoft.AspNetCore.SignalR;
namespace Backend.Hubs;
public class ChatHub : Hub
{
    public async Task RegisterUser(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }

    public async Task SendMessage(string chatId, string content, string senderUserId)
    {
        var usersInChat = GetUsersInChat(chatId);

        var message = new 
        {
            ChatId = chatId,
            Content = content,
            SenderUserId = senderUserId,
            Timestamp = DateTime.UtcNow
        };

        foreach (var userId in usersInChat)
        {
            await Clients.Group(userId).SendAsync("ReceiveMessage", message);
        }
    }

    private List<string> GetUsersInChat(string chatId)
    {
        return new List<string> { "user1", "user2", "user3" };
    }
}