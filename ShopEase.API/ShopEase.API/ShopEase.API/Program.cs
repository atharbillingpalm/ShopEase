using Microsoft.EntityFrameworkCore;
using ShopEase.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────
builder.Services.AddControllers();
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
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// ── Auto-migrate on startup ───────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();