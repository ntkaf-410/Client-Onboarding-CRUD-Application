using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Entities;
using ClientOnboarding.Api.Exceptions;
using ClientOnboarding.Api.Repositories;
using ClientOnboarding.Api.Common;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
        CreatedAt = DbTime.AsUtc(p.CreatedAt),
        UpdatedAt = DbTime.AsUtc(p.UpdatedAt)
    };

    public async Task<PersonalResponse> GetByIdAsync(long id)
    {
        var personal = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Personal with id {id} not found.");
        return ToResponse(personal);
    }

    public async Task<PersonalResponse> CreateAsync(PersonalRequest request)
    {
        var idNumber = request.IdNumber.Trim();

        if (await _repository.ExistsByIdDocumentAsync(request.IdType, idNumber))
            throw new DuplicateResourceException(
            "A client with this ID type and number already exists", "idNumber");

    var now = DbTime.Now();

    var personal = new Personal
    {
        Title = request.Title,
        FirstName = request.FirstName.Trim(),
        MiddleName = TrimOrNull(request.MiddleName),
        LastName = request.LastName.Trim(),
        DateOfBirth = request.DateOfBirth!.Value,
        Gender = request.Gender,
        MaritalStatus = request.MaritalStatus,
        Nationality = request.Nationality.Trim(),
        IdType = request.IdType,
        IdNumber = idNumber,
        IdExpiryDate = request.IdExpiryDate,
        Email = request.Email.Trim(),
        MobileNumber = request.MobileNumber.Trim(),
        Occupation = TrimOrNull(request.Occupation),
        EmploymentStatus = request.EmploymentStatus,
        CreatedAt = now,
        UpdatedAt = now
    };

    try
    {
        await _repository.AddAsync(personal);
    }
    catch (DbUpdateException ex)
        when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
    {
        throw new DuplicateResourceException(
            "A client with this ID type and number already exists", "idNumber");
    }

    return ToResponse(personal);
    }

private static string? TrimOrNull(string? value) =>
    string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}