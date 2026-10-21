using ClientOnboarding.Api.Dtos;

namespace ClientOnboarding.Api.Services;

public interface IAddressService
{
    Task<IReadOnlyList<AddressResponse>> GetByPersonalAsync(long personalId);
    Task<AddressResponse> CreateAsync(long personalId, AddressRequest request);
}