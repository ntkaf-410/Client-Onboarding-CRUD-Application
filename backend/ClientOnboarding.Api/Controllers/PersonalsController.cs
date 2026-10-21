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

    [HttpGet("{id:long}")]
    public async Task<ActionResult<PersonalResponse>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PersonalResponse>> Create([FromBody] PersonalRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<PersonalResponse>> Update(long id, [FromBody] PersonalRequest request)
    {
    var result = await _service.UpdateAsync(id, request);
    return Ok(result);
    }
    
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
    await _service.DeleteAsync(id);
    return NoContent();
    }
}