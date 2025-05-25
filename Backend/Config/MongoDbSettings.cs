namespace Backend.Config;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string VerificationCodesName { get; set; } = null!;
    public Collections Collections { get; set; } = new();
}
