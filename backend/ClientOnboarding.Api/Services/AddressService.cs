using ClientOnboarding.Api.Common;
using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Entities;
using ClientOnboarding.Api.Exceptions;
using ClientOnboarding.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addresses;
    private readonly IPersonalRepository _personals;

    public AddressService(IAddressRepository addresses, IPersonalRepository personals)
    {
        _addresses = addresses;
        _personals = personals;
    }

    public async Task<IReadOnlyList<AddressResponse>> GetByPersonalAsync(long personalId)
    {
        await EnsurePersonalExistsAsync(personalId);
        var addresses = await _addresses.GetByPersonalIdAsync(personalId);
        return addresses.Select(ToResponse).ToList();
    }

    public async Task<AddressResponse> CreateAsync(long personalId, AddressRequest request)
    {
        await EnsurePersonalExistsAsync(personalId);

        if (await _addresses.ExistsByTypeAsync(personalId, request.AddressType))
            throw new DuplicateResourceException(
                $"This client already has a {request.AddressType} address", "addressType");

        var now = DbTime.Now();
        var address = new Address { PersonalId = personalId, CreatedAt = now, UpdatedAt = now };
        ApplyRequest(address, request);

        try
        {
            await _addresses.AddAsync(address);
        }
        catch (DbUpdateException ex) when (DbErrors.IsUniqueViolation(ex))
        {
            throw new DuplicateResourceException(
                $"This client already has a {request.AddressType} address", "addressType");
        }

        return ToResponse(address);
    }

    private async Task EnsurePersonalExistsAsync(long personalId)
    {
        if (!await _personals.ExistsAsync(personalId))
            throw new NotFoundException($"Personal with id {personalId} was not found");
    }

    private static void ApplyRequest(Address address, AddressRequest request)
    {
        address.AddressType = request.AddressType;
        address.AddressLine1 = request.AddressLine1.Trim();
        address.AddressLine2 = TextHelper.TrimOrNull(request.AddressLine2);
        address.Suburb = TextHelper.TrimOrNull(request.Suburb);
        address.City = request.City.Trim();
        address.District = TextHelper.TrimOrNull(request.District);
        address.PostalCode = TextHelper.TrimOrNull(request.PostalCode);
        address.Country = request.Country.Trim();

        address.ResidentialStatus = request.AddressType == "RESIDENTIAL"
            ? request.ResidentialStatus!.Trim()
            : null;
    }

    private static AddressResponse ToResponse(Address a) => new()
    {
        Id = a.Id,
        PersonalId = a.PersonalId,
        AddressType = a.AddressType,
        AddressLine1 = a.AddressLine1,
        AddressLine2 = a.AddressLine2,
        Suburb = a.Suburb,
        City = a.City,
        District = a.District,
        PostalCode = a.PostalCode,
        Country = a.Country,
        ResidentialStatus = a.ResidentialStatus,
        CreatedAt = DbTime.AsUtc(a.CreatedAt),
        UpdatedAt = DbTime.AsUtc(a.UpdatedAt)
    };
}