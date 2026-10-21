using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IAddressRepository
{
    Task<IReadOnlyList<Address>> GetByPersonalIdAsync(long personalId);
    Task<bool> ExistsByTypeAsync(long personalId, string addressType);
    Task<Address> AddAsync(Address address);
}