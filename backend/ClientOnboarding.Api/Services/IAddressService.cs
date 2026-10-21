using ClientOnboarding.Api.Dtos;

namespace ClientOnboarding.Api.Services;

public interface IAddressService
{
    Task<IReadOnlyList<AddressResponse>> GetByPersonalAsync(long personalId);
    Task<AddressResponse> CreateAsync(long personalId, AddressRequest request);
    Task<AddressResponse> UpdateAsync(long id, AddressRequest request);
    Task<AddressResponse> GetByIdAsync(long id);
    Task DeleteAsync(long id);
}