using Backend.Config;
using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Backend.Infrastructure;

public class MongoDbInitializer(IMongoClient mongoClient, IOptions<MongoDbSettings> settings)
{
    private readonly IMongoDatabase _database = mongoClient.GetDatabase(settings.Value.DatabaseName);
    private readonly MongoDbSettings _settings = settings.Value;

    public async Task InitializeDatabaseAsync()
    {
        var collectionName = _settings.VerificationCodesName;

        var filter = new BsonDocument("name", collectionName);
        var collections = await _database.ListCollectionsAsync(new ListCollectionsOptions { Filter = filter });

        if (!await collections.AnyAsync())
        {
            await _database.CreateCollectionAsync(collectionName);
        }

        var collection = _database.GetCollection<VerificationCode>(collectionName);

        var existingIndexes = await collection.Indexes.ListAsync();
        var indexExists = false;
        await existingIndexes.ForEachAsync(index =>
        {
            var indexDocument = index.ToBsonDocument();
            if (indexDocument["key"].AsBsonDocument.Contains("CreatedAt") &&
                indexDocument.Contains("expireAfterSeconds"))
            {
                indexExists = true;
            }
        });

        if (!indexExists)
        {
            var indexKeysDefinition = Builders<VerificationCode>.IndexKeys.Ascending(v => v.CreatedAt);
            var indexOptions = new CreateIndexOptions { ExpireAfter = TimeSpan.FromMinutes(30) };

            var indexModel = new CreateIndexModel<VerificationCode>(indexKeysDefinition, indexOptions);
            await collection.Indexes.CreateOneAsync(indexModel);
        }

        Console.WriteLine("✅ Banco de dados (mongo) inicializado com sucesso!");
    }
}