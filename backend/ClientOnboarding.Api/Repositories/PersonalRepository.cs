using ClientOnboarding.Api.Data;
using ClientOnboarding.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Repositories;

public class PersonalRepository : IPersonalRepository
{
    private readonly AppDbContext _db;

    public PersonalRepository(AppDbContext db) => _db = db;

    public async Task<(IReadOnlyList<Personal> Items, int TotalItems)> GetPagedAsync(
        int page, int size, string? search)
    {
        IQueryable<Personal> query = _db.Personals.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.FirstName + " " + p.LastName, pattern) ||
                EF.Functions.ILike(p.IdNumber, pattern));
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.UpdatedAt)
            .ThenByDescending(p => p.Id)
            .Skip(page * size)
            .Take(size)
            .ToListAsync();

        return (items, totalItems);
    }

    public async Task<Personal?> GetByIdAsync(long id) =>
        await _db.Personals.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public async Task<bool> ExistsByIdDocumentAsync(string idType, string idNumber, long? excludeId = null) =>
    await _db.Personals.AnyAsync(p =>
        p.IdType == idType &&
        p.IdNumber == idNumber &&
        (excludeId == null || p.Id != excludeId));

    public async Task<Personal?> GetByIdForUpdateAsync(long id) =>
    await _db.Personals.FirstOrDefaultAsync(p => p.Id == id);
    public async Task AddAsync(Personal personal)
    {
        await _db.Personals.AddAsync(personal);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Personal personal)
    {
        _db.Personals.Update(personal);
        await _db.SaveChangesAsync();
    }
}