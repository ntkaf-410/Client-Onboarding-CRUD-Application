using ClientOnboarding.Api.Data;
using ClientOnboarding.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly AppDbContext _db;

    public AddressRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<Address>> GetByPersonalIdAsync(long personalId) =>
        await _db.Addresses
            .AsNoTracking()
            .Where(a => a.PersonalId == personalId)
            .OrderBy(a => a.AddressType == "RESIDENTIAL" ? 0 : 1)
            .ToListAsync();

    public async Task<Address?> GetByIdAsync(long id) =>
    await _db.Addresses.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);

public async Task<Address?> GetByIdForUpdateAsync(long id) =>
    await _db.Addresses.FirstOrDefaultAsync(a => a.Id == id);

public async Task<bool> ExistsByTypeAsync(long personalId, string addressType, long? excludeId = null) =>
    await _db.Addresses.AnyAsync(a =>
        a.PersonalId == personalId &&
        a.AddressType == addressType &&
        (excludeId == null || a.Id != excludeId));

public async Task UpdateAsync(Address address)
{
    await _db.SaveChangesAsync();
}

public async Task<bool> DeleteAsync(long id) =>
    await _db.Addresses.Where(a => a.Id == id).ExecuteDeleteAsync() > 0;

    public async Task<Address> AddAsync(Address address)
    {
        _db.Addresses.Add(address);
        await _db.SaveChangesAsync();
        return address;
    }
}