using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Entities;
using ClientOnboarding.Api.Exceptions;
using ClientOnboarding.Api.Repositories;

namespace ClientOnboarding.Api.Services;

public class PersonalService : IPersonalService
{
    private const int MaxSize = 50;
    private readonly IPersonalRepository _repository;

    public PersonalService(IPersonalRepository repository) => _repository = repository;

    public async Task<PagedResponse<PersonalResponse>> GetPagedAsync(int page, int size, string? search)
    {
        page = Math.Max(page, 0);
        size = Math.Clamp(size, 1, MaxSize);

        var (items, totalItems) = await _repository.GetPagedAsync(page, size, search);

        return new PagedResponse<PersonalResponse>
        {
            Items = items.Select(ToResponse).ToList(),
            Page = page,
            Size = size,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)size)
        };
    }

    private static PersonalResponse ToResponse(Personal p) => new()
    {
        Id = p.Id,
        Title = p.Title,
        FirstName = p.FirstName,
        MiddleName = p.MiddleName,
        LastName = p.LastName,
        DateOfBirth = p.DateOfBirth,
        Gender = p.Gender,
        MaritalStatus = p.MaritalStatus,
        Nationality = p.Nationality,
        IdType = p.IdType,
        IdNumber = p.IdNumber,
        IdExpiryDate = p.IdExpiryDate,
        Email = p.Email,
        MobileNumber = p.MobileNumber,
        Occupation = p.Occupation,
        EmploymentStatus = p.EmploymentStatus,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt
    };

    public async Task<PersonalResponse> GetByIdAsync(long id)
    {
        var personal = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Personal with id {id} not found.");
        return ToResponse(personal);
    }
}