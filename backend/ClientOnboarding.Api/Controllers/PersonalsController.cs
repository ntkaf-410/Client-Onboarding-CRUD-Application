using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientOnboarding.Api.Controllers;

[ApiController]
[Route("api/personals")]
public class PersonalsController : ControllerBase
{
    private readonly IPersonalService _service;

    public PersonalsController(IPersonalService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResponse<PersonalResponse>>> GetAll(
        [FromQuery] int page = 0,
        [FromQuery] int size = 10,
        [FromQuery] string? search = null)
    {
        var result = await _service.GetPagedAsync(page, size, search);
        return Ok(result);
    }
}