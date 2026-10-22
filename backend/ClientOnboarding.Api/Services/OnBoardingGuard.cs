using ClientOnboarding.Api.Common;
using ClientOnboarding.Api.Exceptions;
using ClientOnboarding.Api.Repositories;

namespace ClientOnboarding.Api.Services;

public interface IOnboardingGuard
{
    Task EnsureEditableAsync(long personalId);
}

public class OnboardingGuard : IOnboardingGuard
{
    private readonly IOnboardingRepository _onboardings;

    public OnboardingGuard(IOnboardingRepository onboardings) => _onboardings = onboardings;

    public async Task EnsureEditableAsync(long personalId)
    {
        var status = await _onboardings.GetStatusByPersonalIdAsync(personalId);

        if (status == OnboardingStatus.Submitted)
            throw new BusinessRuleException(
                "This client's onboarding has been submitted and is read-only");
    }
}