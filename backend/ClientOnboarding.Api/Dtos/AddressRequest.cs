using System.ComponentModel.DataAnnotations;

namespace ClientOnboarding.Api.Dtos;

public class AddressRequest : IValidatableObject
{
    private static readonly string[] ResidentialStatuses = ["OWNER", "RENTING", "FAMILY", "OTHER"];

    [Required, AllowedValues("RESIDENTIAL", "POSTAL")]
    public string AddressType { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string AddressLine1 { get; set; } = string.Empty;

    [StringLength(100)]
    public string? AddressLine2 { get; set; }

    [StringLength(60)]
    public string? Suburb { get; set; }

    [Required, StringLength(60)]
    public string City { get; set; } = string.Empty;

    [StringLength(60)]
    public string? District { get; set; }

    [RegularExpression(@"^[A-Za-z0-9]{1,10}$", ErrorMessage = "Use up to 10 letters or digits")]
    public string? PostalCode { get; set; }

    [Required, StringLength(60)]
    public string Country { get; set; } = string.Empty;

    public string? ResidentialStatus { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var hasStatus = !string.IsNullOrWhiteSpace(ResidentialStatus);

        if (AddressType == "RESIDENTIAL" && !hasStatus)
        {
            yield return new ValidationResult(
                "Residential status is required for a residential address",
                [nameof(ResidentialStatus)]);
        }
        else if (hasStatus && !ResidentialStatuses.Contains(ResidentialStatus))
        {
            yield return new ValidationResult(
                "Must be one of OWNER, RENTING, FAMILY or OTHER",
                [nameof(ResidentialStatus)]);
        }
    }
}