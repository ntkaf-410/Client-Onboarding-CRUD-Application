namespace ClientOnboarding.Api.Dtos;

public class OnboardingListItem
{
    public long Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string IdNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int CurrentStep { get; set; }
    public DateTime UpdatedAt { get; set; }
}