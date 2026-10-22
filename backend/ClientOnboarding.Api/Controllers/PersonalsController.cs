using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientOnboarding.Api.Controllers;

[ApiController]
[Route("api/personals")]
[Produces("application/json")]
[ProducesResponseType<ErrorResponse>(StatusCodes.Status500InternalServerError)]
public class PersonalsController : ControllerBase
{
    private readonly IPersonalService _service;

    public PersonalsController(IPersonalService service) => _service = service;

    [HttpGet]
    [ProducesResponseType<PagedResponse<PersonalResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<PersonalResponse>>> GetAll(
        [FromQuery] int page = 0,
        [FromQuery] int size = 10,
        [FromQuery] string? search = null)
    {
        var result = await _service.GetPagedAsync(page, size, search);
        return Ok(result);
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<PersonalResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]

    public async Task<ActionResult<PersonalResponse>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType<PersonalResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<PersonalResponse>> Create([FromBody] PersonalRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<PersonalResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status409Conflict)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PersonalResponse>> Update(long id, [FromBody] PersonalRequest request)
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
}