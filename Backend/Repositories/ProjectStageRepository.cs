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

    public async Task<IEnumerable<ProjectStage>> FindByProjectIdAsync(Guid projectId)
    {
        return await _context.ProjectsStages.Where(ps => ps.ProjectId == projectId).ToListAsync();
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
}