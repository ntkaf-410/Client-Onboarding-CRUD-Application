using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IOnboardingRepository
{
    Task<(IReadOnlyList<PersonalOnboarding> Items, int TotalItems)> GetPagedAsync(
        int page, int size, string? status, string? search);
    Task<PersonalOnboarding?> GetByIdAsync(long id);
    Task<bool> ExistsForPersonalAsync(long personalId);
    Task<PersonalOnboarding> AddAsync(PersonalOnboarding onboarding);
    Task<PersonalOnboarding?> GetByIdForUpdateAsync(long id);
    Task UpdateAsync(PersonalOnboarding onboarding);
}

