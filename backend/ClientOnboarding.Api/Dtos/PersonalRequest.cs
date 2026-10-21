using System.ComponentModel.DataAnnotations;

namespace ClientOnboarding.Api.Dtos;

public class PersonalRequest : IValidatableObject
{
    private const string NamePattern = @"^[\p{L} '\-]+$";
    private const int MinimumAge = 18;

    [Required, AllowedValues("Mr", "Mrs", "Ms", "Miss", "Dr", "Prof")]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(50),
     RegularExpression(NamePattern, ErrorMessage = "Use letters, spaces, hyphens and apostrophes only")]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(50),
     RegularExpression(NamePattern, ErrorMessage = "Use letters, spaces, hyphens and apostrophes only")]
    public string? MiddleName { get; set; }

    [Required, StringLength(50),
     RegularExpression(NamePattern, ErrorMessage = "Use letters, spaces, hyphens and apostrophes only")]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateOnly? DateOfBirth { get; set; }

    [Required, AllowedValues("MALE", "FEMALE", "OTHER")]
    public string Gender { get; set; } = string.Empty;

    [Required, AllowedValues("SINGLE", "MARRIED", "DIVORCED", "WIDOWED")]
    public string MaritalStatus { get; set; } = string.Empty;

    [Required, StringLength(60)]
    public string Nationality { get; set; } = string.Empty;

    [Required, AllowedValues("NATIONAL_ID", "PASSPORT", "DRIVERS_LICENCE")]
    public string IdType { get; set; } = string.Empty;

    [Required, RegularExpression(@"^[A-Za-z0-9]{6,30}$", ErrorMessage = "Must be 6 to 30 letters or digits")]
    public string IdNumber { get; set; } = string.Empty;

    public DateOnly? IdExpiryDate { get; set; }

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\+?\d{7,15}$", ErrorMessage = "Use 7 to 15 digits, with an optional leading +")]
    public string MobileNumber { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Occupation { get; set; }

    [Required, AllowedValues("EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED", "STUDENT", "RETIRED")]
    public string EmploymentStatus { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        if (DateOfBirth is { } dob && dob > today.AddYears(-MinimumAge))
        {
            yield return new ValidationResult(
                "Client must be at least 18 years old", [nameof(DateOfBirth)]);
        }

        if (IdType is "PASSPORT" or "DRIVERS_LICENCE")
        {
            if (IdExpiryDate is null)
            {
                yield return new ValidationResult(
                    "ID expiry date is required for this ID type", [nameof(IdExpiryDate)]);
            }
            else if (IdExpiryDate <= today)
            {
                yield return new ValidationResult(
                    "ID expiry date must be in the future", [nameof(IdExpiryDate)]);
            }
        }
    }
}