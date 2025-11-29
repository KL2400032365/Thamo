# Revi API (Minimal .NET 6 Web API)

This workspace contains a minimal ASP.NET Core Web API targeting .NET 6.0.

## Build and run (PowerShell)

```powershell
cd src\Revi.Api
dotnet build
dotnet run
```

The API exposes a sample endpoint:
- `GET /weatherforecast` — returns a small sample payload.

## Recommended VS Code extension
- C# (ms-dotnettools.csharp)

Install it from the terminal:

```powershell
code --install-extension ms-dotnettools.csharp
```

## Notes
- Project targets `net6.0`.
- Use `dotnet restore` if necessary before `dotnet build`.
