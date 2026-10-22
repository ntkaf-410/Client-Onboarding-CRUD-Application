using System.ComponentModel.DataAnnotations;
using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientOnboarding.Api.Controllers;

[ApiController]
[Route("api/onboardings")]
public class OnboardingsController : ControllerBase
{
    private readonly IOnboardingService _service;

    public OnboardingsController(IOnboardingService service) => _service = service;

    [HttpGet]
    [ProducesResponseType<PagedResponse<OnboardingListItem>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResponse<OnboardingListItem>>> GetAll(
        [FromQuery] int page = 0,
        [FromQuery] int size = 10,
        [FromQuery, RegularExpression("^(DRAFT|SUBMITTED)$", ErrorMessage = "Must be DRAFT or SUBMITTED")]
        string? status = null,
        [FromQuery] string? search = null)
    {
        var result = await _service.GetPagedAsync(page, size, status, search);
        return Ok(result);
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<OnboardingResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OnboardingResponse>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType<OnboardingResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OnboardingResponse>> Create([FromBody] OnboardingCreateRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<OnboardingResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<OnboardingResponse>> Update(
        long id, [FromBody] OnboardingUpdateRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]    
public async Task<IActionResult> Delete(long id)
{
    await _service.DeleteAsync(id);
    return NoContent();
}

[HttpPost("{id:long}/submit")]
[ProducesResponseType<OnboardingResponse>(StatusCodes.Status200OK)]
[ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]
[ProducesResponseType<ErrorResponse>(StatusCodes.Status422UnprocessableEntity)]
public async Task<ActionResult<OnboardingResponse>> Submit(long id)
{
    var result = await _service.SubmitAsync(id);
    return Ok(result);
}
}