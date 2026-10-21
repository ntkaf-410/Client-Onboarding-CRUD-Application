using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IPersonalRepository
{
    Task<(IReadOnlyList<Personal> Items, int TotalItems)> GetPagedAsync(int page, int size, string? search);
    Task<Personal?> GetByIdAsync(long id);
    Task<bool> ExistsByIdDocumentAsync(string idType, string idNumber);
    Task AddAsync(Personal personal);
}