using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IPersonalRepository
{
    Task<(IReadOnlyList<Personal> Items, int TotalItems)> GetPagedAsync(int page, int size, string? search);
}