using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- AJOUT CRITIQUE POUR RENDER/KESTREL ---
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.ConfigureKestrel(serverOptions =>
    {
        serverOptions.ListenAnyIP(int.Parse(port));
    });
}
// --- FIN AJOUT CRITIQUE ---
// Configure JSON serialization for Enums
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); 
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// ------------------------------------------------------------------
// ⭐ DÉFINITION UNIQUE ET CONSOLIDÉE DES POLITIQUES CORS
// ------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    // Politique pour la production et le développement local spécifique
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                "https://stn-arbeitsvermittlung-4vtf.vercel.app" // URL de votre frontend en PROD
                                         // URL de votre frontend en DEV
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
            //.AllowCredentials(); // Important si vous utilisez des cookies/auth
        });

    // Politique de secours pour le test (peut être retirée en PROD finale)
    options.AddPolicy("AllowAllDev",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// ------------------------------------------------------------------


// 1. Récupération de la chaîne de connexion.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// NOTE : Suppression de la deuxième AddCors() ici.


// ------------------------------------------------------------------
// PARTIE DE BUILD
// ------------------------------------------------------------------
var app = builder.Build();

// =================================================================
// ⭐️ BLOC DE MIGRATION DE BASE DE DONNÉES (EMPLACEMENT CRITIQUE)
// =================================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate(); 
        Console.WriteLine("INFO: Migrations appliquées avec succès à la base de données PostgreSQL.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "ERREUR CRITIQUE : Échec de l'application des migrations à la base de données.");
    }
}
// =================================================================


// Configure the HTTP request pipeline (MIDDLEWARES)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // En environnement de développement, nous utilisons la politique 'AllowAllDev'
    // C'est souvent plus simple pour le débuggage local.
 //   app.UseCors("AllowAllDev"); 
}


    // En Production (Render), nous utilisons la politique sécurisée 'AllowFrontend'
    app.UseCors("AllowFrontend"); 



app.UseHttpsRedirection(); // Laissez-le ici même si Render gère le SSL

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapControllers(); // Nécessaire si vous utilisez des contrôleurs (MVC/API)
app.MapGet("/test", () => "Le backend fonctionne !");
/* ... (Les MapPost sont inchangés) ... */

// le formular kunde utiliser par le frontend
app.MapPost("/add-kunde", async ([FromBody] Kunde kunde, ApplicationDbContext db) =>
{
    try
    {
        if (kunde == null)
            return Results.BadRequest("Données manquantes.");

        db.Kunden.Add(kunde);
        await db.SaveChangesAsync();

        return Results.Ok("Client (Kunde) ajouté avec succès !");
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.InnerException?.Message ?? ex.Message);
    }
});
// le formular subunternehmer utiliser par le frontend
app.MapPost("/add-subunternehmer", async ([FromBody] Subunternehmer subunternehmer, ApplicationDbContext db) =>
{
    try
    {
        if (subunternehmer == null)
            return Results.BadRequest("Données manquantes.");

        db.Subunternehmer.Add(subunternehmer);
        await db.SaveChangesAsync();

        return Results.Ok("Service (subunternehmer) ajouté avec succès !");
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.InnerException?.Message ?? ex.Message);
    }
});
// Démarre l'application
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}