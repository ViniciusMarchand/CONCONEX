using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class VerificationCode
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Code { get; set; } = string.Empty;
        public string Email { get; set; }  = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
