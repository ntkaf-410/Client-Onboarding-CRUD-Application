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
}