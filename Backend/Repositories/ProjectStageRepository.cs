using Backend.DTO;
using Backend.Enums;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ProjectStageRepository(ApplicationDbContext context) : IProjectStageRepository
{

    private readonly ApplicationDbContext _context = context;

    public async Task<ProjectStage> AddAsync(ProjectStage project)
    {
        _context.ProjectsStages.Add(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<IEnumerable<ProjectStageResponseDTO>> FindByProjectIdAsync(Guid projectId)
    {
        return await _context.ProjectsStages
        .Where(ps => ps.ProjectId == projectId && !ps.IsDeleted)
        .OrderBy(ps => ps.CreatedAt)
        .Include(ps => ps.Images)
        .Select(ps => new ProjectStageResponseDTO
        {
            Deadline = ps.Deadline,
            Description = ps.Description,
            Id = ps.Id,
            Title = ps.Title,
            Status = ps.Status.ToString(),
            Images = ps.Images,
            Order = ps.Order
        })
        .ToListAsync();
    }

    public async Task<ProjectStage?> FindByIdAsync(Guid id)
    {
        return await _context.ProjectsStages.FirstOrDefaultAsync(ps => ps.Id == id);
    }

    public async Task<IEnumerable<ProjectStage>> FindAllAsync()
    {
        return await _context.ProjectsStages.OrderByDescending(ps => ps.CreatedAt).Take(20).ToListAsync();
    }

    public async Task<ProjectStage> UpdateAsync(ProjectStage project)
    {
        _context.ProjectsStages.Update(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<Image> SaveImageAsync(Image image)
    {
        await _context.Images.AddAsync(image);
        await _context.SaveChangesAsync();
        return image;
    }

    public async Task RemoveImageAsync(Image image)
    {
        _context.Images.Remove(image);
        await _context.SaveChangesAsync();
    }

    public async Task<Image?> FindImageById(Guid id)
    {
        return await _context.Images.FindAsync(id);
    }
}