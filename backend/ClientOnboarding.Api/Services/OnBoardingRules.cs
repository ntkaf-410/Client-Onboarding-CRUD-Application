using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Entities;

namespace ClientOnboarding.Api.Services;

public static class OnboardingRules
{
    public static List<FieldError> FindMissing(Personal personal, IEnumerable<Address> addresses)
    {
        var missing = new List<FieldError>();

        void Require(string field, string? value, string label)
        {
            if (string.IsNullOrWhiteSpace(value))
                missing.Add(new FieldError { Field = field, Message = $"{label} is required" });
        }

        Require("title", personal.Title, "Title");
        Require("firstName", personal.FirstName, "First name");
        Require("lastName", personal.LastName, "Last name");
        Require("gender", personal.Gender, "Gender");
        Require("maritalStatus", personal.MaritalStatus, "Marital status");
        Require("nationality", personal.Nationality, "Nationality");
        Require("idType", personal.IdType, "ID type");
        Require("idNumber", personal.IdNumber, "ID number");
        Require("email", personal.Email, "Email");
        Require("mobileNumber", personal.MobileNumber, "Mobile number");
        Require("employmentStatus", personal.EmploymentStatus, "Employment status");

        if (personal.DateOfBirth == default)
            missing.Add(new FieldError { Field = "dateOfBirth", Message = "Date of birth is required" });

        if ((personal.IdType is "PASSPORT" or "DRIVERS_LICENCE") && personal.IdExpiryDate is null)
            missing.Add(new FieldError { Field = "idExpiryDate", Message = "ID expiry date is required for this ID type" });

        var residential = addresses.FirstOrDefault(a => a.AddressType == "RESIDENTIAL");

        if (residential is null)
        {
            missing.Add(new FieldError
            {
                Field = "residentialAddress",
                Message = "A residential address is required"
            });
        }
        else
        {
            Require("residentialAddress.addressLine1", residential.AddressLine1, "Address line 1");
            Require("residentialAddress.city", residential.City, "City / town");
            Require("residentialAddress.country", residential.Country, "Country");
            Require("residentialAddress.residentialStatus", residential.ResidentialStatus, "Residential status");
        }

        return missing;
    }
}