
using Backend.Config;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
namespace Backend.Repositories;

public class VerificationCodeRepository : IVerificationCodeRepository
{
    private readonly IMongoCollection<VerificationCode> _verificationCodesCollection;

    public VerificationCodeRepository(
        IOptions<MongoDbSettings> mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.Value.DatabaseName);

        _verificationCodesCollection = mongoDatabase.GetCollection<VerificationCode>(
            mongoDbSettings.Value.VerificationCodesName);
    }

    // public async Task<List<VerificationCode>> GetAsync() =>
    //     await _verificationCodesCollection.Find(_ => true).ToListAsync();

    public async Task<VerificationCode?> GetByEmail(string email) =>
        await _verificationCodesCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task CreateAsync(VerificationCode vc) =>
        await _verificationCodesCollection.InsertOneAsync(vc);

    // public async Task UpdateAsync(string id, VerificationCode vc) =>
    //     await _verificationCodesCollection.ReplaceOneAsync(x => x.Id == id, vc);

    public async Task RemoveAsync(string id) =>
        await _verificationCodesCollection.DeleteOneAsync(x => x.Id == id);
}