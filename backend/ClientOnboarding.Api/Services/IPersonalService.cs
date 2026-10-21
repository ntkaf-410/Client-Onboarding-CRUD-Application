using ClientOnboarding.Api.Dtos;

namespace ClientOnboarding.Api.Services;

public interface IPersonalService
{
    Task<PagedResponse<PersonalResponse>> GetPagedAsync(int page, int size, string? search);
    Task<PersonalResponse> GetByIdAsync(long id);
    Task<PersonalResponse> CreateAsync(PersonalRequest request);
    Task<PersonalResponse> UpdateAsync(long id, PersonalRequest request);
}