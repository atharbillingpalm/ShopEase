
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShopEase.API.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────
builder.Services.AddControllers();
// ── JWT Authentication ──────────────────────
var jwtKey = builder.Configuration["JwtSettings:SecretKey"]!;
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            Microsoft.AspNetCore.Authentication.JwtBearer
            .JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme =
            Microsoft.AspNetCore.Authentication.JwtBearer
            .JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration[
                    "JwtSettings:Issuer"],
                ValidAudience = builder.Configuration[
                    "JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey)),
            };
    });

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Database ──────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
    .ConfigureWarnings(w =>
        w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics
            .RelationalEventId.PendingModelChangesWarning))
);

// ── CORS — allow React app ────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "https://polite-mud-079dfb600.7.azurestaticapps.net"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Middleware ────────────────────────────────
// Enable Swagger in all environments for portfolio demo
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShopEase API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("ReactApp");   // ← must be before MapControllers
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();

// ── Auto-migrate on startup ───────────────────
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration warning: {ex.Message}");
        // App continues even if migration fails
    }
}

app.Run();