using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Backend.Services.Domain;
using Backend.Services.Interfaces;

namespace Backend.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IVerificationCodeRepository, VerificationCodeRepository>();
        services.AddScoped<IVerificationCodeService, VerificationCodeService>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProjectStageRepository, ProjectStageRepository>();
        services.AddScoped<IProjectStageService, ProjectStageService>();
        services.AddScoped<IHttpContextService, HttpContextService>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IUserPushTokenRepository, UserPushTokenRepository>();
        services.AddScoped<IUserPushTokenService, UserPushTokenService>();
        services.AddScoped<IPushNotificationService, PushNotificationService>();
        services.AddScoped<ICalendarConfigurationRepository, CalendarConfigurationRepository>();
        services.AddScoped<ICalendarConfigurationService, CalendarConfigurationService>();
        services.AddHttpClient();

        
        // services.AddScoped<VerificationCodesService>();   

        return services;
    }
}

