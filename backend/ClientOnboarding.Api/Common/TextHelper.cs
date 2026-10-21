namespace ClientOnboarding.Api.Common;

public static class TextHelper
{
    public static string? TrimOrNull(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}