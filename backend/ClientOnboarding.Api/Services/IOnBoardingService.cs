using ClientOnboarding.Api.Dtos;

namespace ClientOnboarding.Api.Services;

public interface IOnboardingService
{
    Task<PagedResponse<OnboardingListItem>> GetPagedAsync(int page, int size, string? status, string? search);
    Task<OnboardingResponse> GetByIdAsync(long id);
    Task<OnboardingResponse> CreateAsync(OnboardingCreateRequest request);
}