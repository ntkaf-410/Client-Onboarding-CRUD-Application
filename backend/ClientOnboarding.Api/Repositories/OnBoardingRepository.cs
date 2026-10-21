using ClientOnboarding.Api.Data;
using ClientOnboarding.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Repositories;

public class OnboardingRepository : IOnboardingRepository
{
    private readonly AppDbContext _db;

    public OnboardingRepository(AppDbContext db) => _db = db;

    public async Task<(IReadOnlyList<PersonalOnboarding> Items, int TotalItems)> GetPagedAsync(
        int page, int size, string? status, string? search)
    {
        IQueryable<PersonalOnboarding> query = _db.Set<PersonalOnboarding>().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(o => o.Status == status);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(o =>
                EF.Functions.ILike(o.Personal.FirstName + " " + o.Personal.LastName, pattern) ||
                EF.Functions.ILike(o.Personal.IdNumber, pattern));
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .Include(o => o.Personal)
            .OrderByDescending(o => o.UpdatedAt)
            .ThenByDescending(o => o.Id)
            .Skip(page * size)
            .Take(size)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<PersonalOnboarding?> GetByIdAsync(long id) =>
        await _db.Set<PersonalOnboarding>().AsNoTracking().FirstOrDefaultAsync(o => o.Id == id);

    public async Task<bool> ExistsForPersonalAsync(long personalId) =>
        await _db.Set<PersonalOnboarding>().AnyAsync(o => o.PersonalId == personalId);

    public async Task<PersonalOnboarding> AddAsync(PersonalOnboarding onboarding)
    {
        _db.Set<PersonalOnboarding>().Add(onboarding);
        await _db.SaveChangesAsync();
        return onboarding;
    }
}