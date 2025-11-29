using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);
// Configure DbContext and Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=revi.db"));

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = false
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// Enable static file serving for wwwroot
app.UseStaticFiles();

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
    var user = new IdentityUser { UserName = req.Username, Email = req.Email };
    var result = await userManager.CreateAsync(user, req.Password);
    if (!result.Succeeded) return Results.BadRequest(result.Errors);
    return Results.Ok(new { user.Id, user.UserName, user.Email });
});

app.MapPost("/auth/login", async (UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, LoginRequest req) =>
{
    var user = await userManager.FindByNameAsync(req.Username);
    if (user == null) return Results.Unauthorized();
    var result = await signInManager.CheckPasswordSignInAsync(user, req.Password, false);
    if (!result.Succeeded) return Results.Unauthorized();
    // In a real application issue a JWT here. This scaffold returns basic user info.
    return Results.Ok(new { user.Id, user.UserName, user.Email });
});

app.MapGet("/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? true) return Results.Unauthorized();
    var id = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    return Results.Ok(new { Id = id });
}).RequireAuthorization();

app.MapControllers();

app.Run();

// DTOs used by the scaffold
public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Username, string Password);