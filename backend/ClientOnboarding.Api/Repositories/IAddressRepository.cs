using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Repositories;

public interface IAddressRepository
{
    Task<IReadOnlyList<Address>> GetByPersonalIdAsync(long personalId);
    Task<Address?> GetByIdAsync(long id);
    
    Task<Address?> GetByIdForUpdateAsync(long id);
    Task<bool> ExistsByTypeAsync(long personalId, string addressType, long? excludeId = null);
    Task UpdateAsync(Address address);
    Task<bool> DeleteAsync(long id);    
    Task<Address> AddAsync(Address address);
}