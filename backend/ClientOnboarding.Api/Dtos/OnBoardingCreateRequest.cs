using System.ComponentModel.DataAnnotations;

namespace ClientOnboarding.Api.Dtos;

public class OnboardingCreateRequest
{
    [Required, Range(1, long.MaxValue)]
    public long? PersonalId { get; set; }
}