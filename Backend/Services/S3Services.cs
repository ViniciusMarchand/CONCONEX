using Amazon.S3;
using Amazon.S3.Model;
using Backend.DTO;
using Backend.Exceptions;
using Microsoft.Extensions.Configuration;
namespace Backend.Services;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service(IConfiguration config)
    {

        _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME")
                     ?? config["AWS:BucketName"]
                     ?? throw new ArgumentNullException("AWS_BUCKET_NAME",
                        "Configure a variável de ambiente AWS_BUCKET_NAME ou AWS:BucketName no appsettings.json");

        var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID")
                       ?? config["AWS:AccessKey"]
                       ?? throw new ArgumentNullException("AWS_ACCESS_KEY_ID",
                          "Configure a variável de ambiente AWS_ACCESS_KEY_ID ou AWS:AccessKey no appsettings.json");

        var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
                       ?? config["AWS:SecretKey"]
                       ?? throw new ArgumentNullException("AWS_SECRET_ACCESS_KEY",
                          "Configure a variável de ambiente AWS_SECRET_ACCESS_KEY ou AWS:SecretKey no appsettings.json");

        var region = Environment.GetEnvironmentVariable("AWS_REGION")
                    ?? config["AWS:Region"]
                    ?? "us-east-2";

        _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {

        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new InvalidFileExtension("Invalid image format. Only JPG, JPEG or PNG are allowed.");
        }

        if (file.Length > 10 * 1024 * 1024)
            throw new ArgumentException("Maximum allowed size: 10MB.");


        var fileName = $"uploads/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        using (var stream = file.OpenReadStream())
        {
            await _s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead,
            });
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";
    }

    public async Task<string> UploadProjectPictureAsync(IFormFile file, Guid projectId)
    {
        var fileName = $"{projectId}/main_picture{Path.GetExtension(file.FileName)}";

        using (var stream = file.OpenReadStream())
        {
            await _s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead,
            });
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";
    }
    public async Task<string> AddProjectStageImage(IFormFile file, Guid projectId, Guid projectStageId, Guid imageId)
    {
        var fileName = $"{projectId}/{projectStageId}/{imageId}{Path.GetExtension(file.FileName)}";

        using (var stream = file.OpenReadStream())
        {
            await _s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead,
            });
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";
    }

    public async Task<bool> RemoveProjectStageImage(Guid projectId, Guid projectStageId, Guid imageId, string fileExtension)
    {


        var fileName = $"{projectId}/{projectStageId}/{imageId}{fileExtension}";

        try
        {
            try
            {
                await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
                {
                    BucketName = _bucketName,
                    Key = fileName
                });
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                Console.WriteLine($"Arquivo {fileName} não encontrado no bucket.");
                return false;
            }

            // Deleta o objeto
            await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName
            });

            Console.WriteLine($"Arquivo {fileName} removido com sucesso.");
            return true;
        }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine($"Erro ao deletar arquivo: {ex.Message}");
            return false;
        }

    }

     public async Task<string> SaveAttachmentsAsync(MessageDTO dto)
    {
        var file = dto.Attachment;

        if (file == null)
        {
            return "";
        }


        var fileName = $"{dto.ProjectId}/chat/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        using (var stream = file.OpenReadStream())
        {
            await _s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead,
            });
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";
    }


}