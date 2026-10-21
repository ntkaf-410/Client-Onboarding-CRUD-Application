using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IPersonalRepository
{
    Task<(IReadOnlyList<Personal> Items, int TotalItems)> GetPagedAsync(int page, int size, string? search);
    Task<Personal?> GetByIdAsync(long id);
    Task<bool> ExistsByIdDocumentAsync(string idType, string idNumber, long? excludeId = null);
    Task<Personal?> GetByIdForUpdateAsync(long id);
    Task UpdateAsync(Personal personal);
    Task AddAsync(Personal personal);
    Task<bool> DeleteAsync(long id);
    Task<bool> ExistsAsync(long id);
}