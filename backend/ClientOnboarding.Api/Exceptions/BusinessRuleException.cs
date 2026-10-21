using ClientOnboarding.Api.Dtos;

namespace ClientOnboarding.Api.Exceptions;

public class BusinessRuleException : Exception
{
    public IReadOnlyList<FieldError> Details { get; }

    public BusinessRuleException(string message, IReadOnlyList<FieldError>? details = null)
        : base(message)
    {
        Details = details ?? [];
    }
}