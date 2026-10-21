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
    public async Task<ActionResult<OnboardingResponse>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<OnboardingResponse>> Create([FromBody] OnboardingCreateRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}