using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

















string[] Summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = Random.Shared.Next(-20, 55),
        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
    }).ToArray();
    return forecast;
});

// Minimal auth endpoints (register/login) - basic examples
app.MapPost("/auth/register", async (UserManager<IdentityUser> userManager, RegisterRequest req) =>
{
    var user = new IdentityUser { UserName = req.Email, Email = req.Email };
    var result = await userManager.CreateAsync(user, req.Password);
    if (!result.Succeeded) return Results.BadRequest(result.Errors);
    return Results.Ok(new { user.Id, user.Email });
});

app.MapPost("/auth/login", async (UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, LoginRequest req) =>
{
    var user = await userManager.FindByEmailAsync(req.Email);
    if (user == null) return Results.Unauthorized();
    var result = await signInManager.CheckPasswordSignInAsync(user, req.Password, false);
    if (!result.Succeeded) return Results.Unauthorized();
    // In a real application issue a JWT here. This scaffold returns basic user info.
    return Results.Ok(new { user.Id, user.Email });
});

app.MapGet("/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? true) return Results.Unauthorized();
    var id = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    return Results.Ok(new { Id = id });
}).RequireAuthorization();

app.MapControllers();

app.Run();

// DTOs and minimal model used by the scaffold
public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);

public class WeatherForecast
{
    public DateTime Date { get; set; }
    public int TemperatureC { get; set; }
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    public string? Summary { get; set; }
}