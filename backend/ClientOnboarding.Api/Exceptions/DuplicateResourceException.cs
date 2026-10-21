namespace ClientOnboarding.Api.Exceptions;

public class DuplicateResourceException : Exception
{
    public string? Field { get; }

    public DuplicateResourceException(string message, string? field = null) : base(message)
    {
        Field = field;
    }
}