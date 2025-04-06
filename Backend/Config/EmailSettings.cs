namespace Backend.Config;

public class EmailSettings
{
    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; }
    public string AppEmail { get; set; } = string.Empty;
    public string EmailKey { get; set; } = string.Empty;
}
