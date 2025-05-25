
using Backend.Config;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
namespace Backend.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly IMongoCollection<Message> _messageCollection;

    public MessageRepository(
        IOptions<MongoDbSettings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.Value.DatabaseName);

        _messageCollection = mongoDatabase.GetCollection<Message>(
            mongoDbSettings.Value.Collections.MessagesName);
    }

    public async Task CreateAsync(Message message)
    {
        await _messageCollection.InsertOneAsync(message);
    }

    public async Task<List<Message>> GetByChatIdAsync(Guid projectId)
    {
        return await _messageCollection
            .Find(m => m.ProjectId == projectId)
            .SortBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task<Message?> GetByIdAsync(string id)
    {
        var objectId = new ObjectId(id);
        return await _messageCollection
            .Find(m => m.Id == objectId)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(string id, Message updatedMessage)
    {
        var objectId = new ObjectId(id);
        await _messageCollection.ReplaceOneAsync(
            m => m.Id == objectId, updatedMessage);
    }

    public async Task DeleteAsync(string id)
    {
        var objectId = new ObjectId(id);
        await _messageCollection.DeleteOneAsync(m => m.Id == objectId);
    }

    public async Task<List<Message>> GetByProjectIdPagedAsync(Guid chatId, int page, int pageSize)
    {
        var filter = Builders<Message>.Filter.Eq(m => m.ProjectId, chatId);

        var mensagens = await _messageCollection
            .Find(filter)
            .SortByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return [.. mensagens.OrderByDescending(m => m.SentAt)];
    }

    public async Task<int> GetUnreadMessagesQuantityAsync(Guid projectId, string userId)
    {
        var filter = Builders<Message>.Filter.And(
            Builders<Message>.Filter.Eq(m => m.ProjectId, projectId),
            Builders<Message>.Filter.Eq(m => m.Read, false),
            Builders<Message>.Filter.Ne(m => m.UserId, Guid.Parse(userId))
        );

        return (int)await _messageCollection.CountDocumentsAsync(filter);
    }


    public async Task<Message> GetLastMessage(Guid projectId)
    {
        var filter = Builders<Message>.Filter.Eq(m => m.ProjectId, projectId);

        var sort = Builders<Message>.Sort.Descending(m => m.SentAt);

        var options = new FindOptions<Message>
        {
            Sort = sort,
            Limit = 1
        };

        var cursor = await _messageCollection.FindAsync(filter, options);
        var lastMessage = await cursor.FirstOrDefaultAsync();

        return lastMessage;
    }


    public async Task ReadMessagesFromChat(Guid chatId, string currentUserId)
    {
        var filter = Builders<Message>.Filter.And(
            Builders<Message>.Filter.Eq(m => m.ProjectId, chatId),
            Builders<Message>.Filter.Ne(m => m.UserId, Guid.Parse(currentUserId)),
            Builders<Message>.Filter.Eq(m => m.Read, false)
        );

        var update = Builders<Message>.Update
            .Set(m => m.Read, true);
            // .Set(m => m.ReadAt, DateTime.UtcNow);

        var result = await _messageCollection.UpdateManyAsync(filter, update);

    }
}