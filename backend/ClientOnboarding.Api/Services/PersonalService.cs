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
        (page, size) = Paging.Normalise(page, size);

        var (items, totalItems) = await _repository.GetPagedAsync(page, size, search);

        return new PagedResponse<PersonalResponse>
        {
            Items = items.Select(ToResponse).ToList(),
            Page = page,
            Size = size,
            TotalItems = totalItems,
            TotalPages = Paging.TotalPages(totalItems, size)
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
        MiddleName = TextHelper.TrimOrNull(request.MiddleName),
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
        Occupation = TextHelper.TrimOrNull(request.Occupation),
        EmploymentStatus = request.EmploymentStatus,
        CreatedAt = now,
        UpdatedAt = now
    };
    ApplyRequest(personal, request);

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
    
private static void ApplyRequest(Personal personal, PersonalRequest request)
{
    personal.Title = request.Title;
    personal.FirstName = request.FirstName.Trim();
    personal.MiddleName = TextHelper.TrimOrNull(request.MiddleName);
    personal.LastName = request.LastName.Trim();
    personal.DateOfBirth = request.DateOfBirth!.Value;
    personal.Gender = request.Gender;
    personal.MaritalStatus = request.MaritalStatus;
    personal.Nationality = request.Nationality.Trim();
    personal.IdType = request.IdType;
    personal.IdNumber = request.IdNumber.Trim();
    personal.IdExpiryDate = request.IdExpiryDate;
    personal.Email = request.Email.Trim();
    personal.MobileNumber = request.MobileNumber.Trim();
    personal.Occupation = TextHelper.TrimOrNull(request.Occupation);
    personal.EmploymentStatus = request.EmploymentStatus;
}

private static bool IsUniqueViolation(DbUpdateException ex) =>
    ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
public async Task<PersonalResponse> UpdateAsync(long id, PersonalRequest request)
{
    var personal = await _repository.GetByIdForUpdateAsync(id)
        ?? throw new NotFoundException($"Personal with id {id} was not found");

    var idNumber = request.IdNumber.Trim();

    if (await _repository.ExistsByIdDocumentAsync(request.IdType, idNumber, excludeId: id))
        throw new DuplicateResourceException(
            "A client with this ID type and number already exists", "idNumber");

    ApplyRequest(personal, request);
    personal.UpdatedAt = DbTime.Now();

    try
    {
        await _repository.UpdateAsync(personal);
    }
    catch (DbUpdateException ex) when (DbErrors.IsUniqueViolation(ex))
    {
        throw new DuplicateResourceException(
            "A client with this ID type and number already exists", "idNumber");
    }

    return ToResponse(personal);
}
public async Task DeleteAsync(long id)
{
    var deleted = await _repository.DeleteAsync(id);
    if (!deleted)
        throw new NotFoundException($"Personal with id {id} was not found");
}
}