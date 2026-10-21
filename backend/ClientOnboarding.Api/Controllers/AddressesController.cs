using ClientOnboarding.Api.Dtos;
using ClientOnboarding.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientOnboarding.Api.Controllers;

[ApiController]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _service;

    public AddressesController(IAddressService service) => _service = service;

    [HttpGet("api/personals/{personalId:long}/addresses")]
    public async Task<ActionResult<IReadOnlyList<AddressResponse>>> GetByPersonal(long personalId)
    {
        var result = await _service.GetByPersonalAsync(personalId);
        return Ok(result);
    }

    [HttpPost("api/personals/{personalId:long}/addresses")]
    public async Task<ActionResult<AddressResponse>> Create(
        long personalId, [FromBody] AddressRequest request)
    {
        var created = await _service.CreateAsync(personalId, request);
        return Created($"/api/addresses/{created.Id}", created);
    }

    [HttpGet("api/addresses/{id:long}")]
    public async Task<ActionResult<AddressResponse>> GetById(long id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpPut("api/addresses/{id:long}")]
    public async Task<ActionResult<AddressResponse>> Update(long id, [FromBody] AddressRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("api/addresses/{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}