namespace ClientOnboarding.Api.Common;

public static class ValidationHelper
{
    public static string ToFieldName(string key)
    {
        key = key.TrimStart('$', '.');
        return key.Length == 0 ? key : char.ToLowerInvariant(key[0]) + key[1..];
    }
}