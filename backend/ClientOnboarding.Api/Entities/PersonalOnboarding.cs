namespace ClientOnboarding.Api.Entities;

public class PersonalOnboarding
{
    public long Id { get; set; }
    public long PersonalId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int CurrentStep { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Personal Personal { get; set; } = null!;
}