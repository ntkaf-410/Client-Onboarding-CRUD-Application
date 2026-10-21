using ClientOnboarding.Api.Common;
using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Entities;
using ClientOnboarding.Api.Exceptions;
using ClientOnboarding.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ClientOnboarding.Api.Services;

public class OnboardingService : IOnboardingService
{
    private readonly IOnboardingRepository _onboardings;
    private readonly IPersonalRepository _personals;
    private readonly IPersonalService _personalService;
    private readonly IAddressService _addressService;

    public OnboardingService(
        IOnboardingRepository onboardings,
        IPersonalRepository personals,
        IPersonalService personalService,
        IAddressService addressService)
    {
        _onboardings = onboardings;
        _personals = personals;
        _personalService = personalService;
        _addressService = addressService;
    }

    public async Task<PagedResponse<OnboardingListItem>> GetPagedAsync(
        int page, int size, string? status, string? search)
    {
        (page, size) = Paging.Normalise(page, size);

        var (items, totalItems) = await _onboardings.GetPagedAsync(page, size, status, search);

        return new PagedResponse<OnboardingListItem>
        {
            Items = items.Select(ToListItem).ToList(),
            Page = page,
            Size = size,
            TotalItems = totalItems,
            TotalPages = Paging.TotalPages(totalItems, size)
        };
    }

    public async Task<OnboardingResponse> GetByIdAsync(long id)
    {
        var onboarding = await _onboardings.GetByIdAsync(id)
            ?? throw new NotFoundException($"Onboarding with id {id} was not found");

        var personal = await _personalService.GetByIdAsync(onboarding.PersonalId);
        var addresses = await _addressService.GetByPersonalAsync(onboarding.PersonalId);

        return ToResponse(onboarding, personal, addresses);
    }

    public async Task<OnboardingResponse> CreateAsync(OnboardingCreateRequest request)
    {
        var personalId = request.PersonalId!.Value;

        if (!await _personals.ExistsAsync(personalId))
            throw new NotFoundException($"Personal with id {personalId} was not found");

        // One client, one onboarding (section 4.1)
        if (await _onboardings.ExistsForPersonalAsync(personalId))
            throw new DuplicateResourceException(
                "This client already has an onboarding", "personalId");

        var now = DbTime.Now();
        var onboarding = new PersonalOnboarding
        {
            PersonalId = personalId,
            Status = OnboardingStatus.Draft,
            CurrentStep = 1,
            CreatedAt = now,
            UpdatedAt = now
        };

        try
        {
            await _onboardings.AddAsync(onboarding);
        }
        catch (DbUpdateException ex) when (DbErrors.IsUniqueViolation(ex))
        {
            throw new DuplicateResourceException(
                "This client already has an onboarding", "personalId");
        }

        return await GetByIdAsync(onboarding.Id);
    }

    private static OnboardingListItem ToListItem(PersonalOnboarding o) => new()
    {
        Id = o.Id,
        ClientName = $"{o.Personal.FirstName} {o.Personal.LastName}",
        IdNumber = o.Personal.IdNumber,
        Status = o.Status,
        CurrentStep = o.CurrentStep,
        UpdatedAt = DbTime.AsUtc(o.UpdatedAt)
    };

    private static OnboardingResponse ToResponse(
        PersonalOnboarding o, PersonalResponse personal, IReadOnlyList<AddressResponse> addresses) => new()
    {
        Id = o.Id,
        PersonalId = o.PersonalId,
        Status = o.Status,
        CurrentStep = o.CurrentStep,
        SubmittedAt = o.SubmittedAt is { } submitted ? DbTime.AsUtc(submitted) : null,
        CreatedAt = DbTime.AsUtc(o.CreatedAt),
        UpdatedAt = DbTime.AsUtc(o.UpdatedAt),
        Personal = personal,
        Addresses = addresses
    };
}