using ClientOnboarding.Api.Data;
using Microsoft.EntityFrameworkCore;
using ClientOnboarding.Api.Repositories;
using ClientOnboarding.Api.Services;
using ClientOnboarding.Api.Middleware;
using ClientOnboarding.Api.Common;
using ClientOnboarding.Api.Dtos;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var fieldErrors = context.ModelState
                .Where(entry => entry.Value is { Errors.Count: > 0 })
                .SelectMany(entry => entry.Value!.Errors.Select(error => new FieldError
                {
                    Field = ValidationHelper.ToFieldName(entry.Key),
                    Message = entry.Key.StartsWith('$') ? "Invalid value" : error.ErrorMessage
                }))
                .ToList();

            return new BadRequestObjectResult(new ErrorResponse
            {
                Status = StatusCodes.Status400BadRequest,
                Error = "VALIDATION_ERROR",
                Message = "One or more fields are invalid",
                FieldErrors = fieldErrors
            });
        };
    });// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

builder.Services.AddScoped<IPersonalRepository, PersonalRepository>();
builder.Services.AddScoped<IPersonalService, PersonalService>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<IAddressService, AddressService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    Console.WriteLine($"Personal rows: {await db.Personals.CountAsync()}");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Client Onboarding API v1");
        options.RoutePrefix = "swagger-ui";
    });
}

app.Environment.IsDevelopment();

app.UseAuthorization();

app.MapControllers();

app.Run();
