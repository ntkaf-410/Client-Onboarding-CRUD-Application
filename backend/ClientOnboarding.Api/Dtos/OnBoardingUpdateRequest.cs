using System.ComponentModel.DataAnnotations;

namespace ClientOnboarding.Api.Dtos;

public class OnboardingUpdateRequest
{
    [Required, Range(1, 3)]
    public int? CurrentStep { get; set; }
}