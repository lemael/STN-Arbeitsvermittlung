using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models; // Ajouté : Nécessaire pour les modèles Kunde, Betreff, ProjektArt, Status, et probablement WeatherForecast
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// --- DÉBUT AJOUT CORS ---
builder.Services.AddCors(options =>
{
    // Policy générique pour permettre l'accès depuis n'importe quelle origine. 
    // En production, il est conseillé de spécifier l'URL exacte de votre frontend.
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
           // policy.WithOrigins("https://ecommerce-project-2kvd.onrender.com/")
          policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
// --- FIN AJOUT CORS ---
// 1. Récupération de la chaîne de connexion.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Configuration du CORS (TRÈS IMPORTANT pour les appels depuis le frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // IMPORTANT : Remplacez "*" par l'URL de production de votre frontend (ex: https://votre-frontend.vercel.app)
            // Laissez "*" pour les tests si vous n'êtes pas sûr du domaine.
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});





// ------------------------------------------------------------------
// PARTIE DE BUILD
// ------------------------------------------------------------------
var app = builder.Build();

// =================================================================
// ⭐️ BLOC DE MIGRATION DE BASE DE DONNÉES (EMPLACEMENT CRITIQUE)
// Exécuté après la construction de l'hôte, avant le démarrage du serveur.
// =================================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // Cette ligne applique toutes les migrations en attente à la base de données.
        context.Database.Migrate(); 
        Console.WriteLine("INFO: Migrations appliquées avec succès à la base de données PostgreSQL.");
    }
    catch (Exception ex)
    {
        // En cas d'erreur de connexion ou de migration
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
}

app.UseHttpsRedirection();

// Utilisation de la politique CORS (doit être avant UseAuthorization et MapControllers)
app.UseCors("AllowSpecificOrigin"); 

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
/*
// Endpoint pour l'ajout d'un nouveau client (Kunde) utilisant FormData
app.MapPost("/add-kunde-formdata", async (HttpRequest request, ApplicationDbContext db) =>
{
    try
    {
        var form = await request.ReadFormAsync();
        
        var name = form["Name"].ToString();
        var email = form["Email"].ToString();
        var telefonnummer = form["Telefonnummer"].ToString();
        var projektBeschreibung = form["ProjektBeschreibung"].ToString();
        
        // Lecture des ENUMS et de la DATE (nécessite un parsing manuel)
        var betreffString = form["Betreff"].ToString();
        var projektArtString = form["ProjektArt"].ToString();
        var statusString = form["Status"].ToString();
        var baubeginnString = form["Baubeginn"].ToString();

        // --- Validation et Parsing ---
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(projektBeschreibung))
        {
            return Results.BadRequest("Le nom, l'email et la description du projet sont obligatoires.");
        }
        
        // Parsing des ENUMS
        if (!Enum.TryParse(betreffString, true, out Betreff betreff) ||
            !Enum.TryParse(projektArtString, true, out ProjektArt projektArt) ||
            !Enum.TryParse(statusString, true, out Status status))
        {
            return Results.BadRequest("Valeur Betreff, ProjektArt ou Status invalide.");
        }

        // Parsing de la DATE
        if (!DateTime.TryParse(baubeginnString, out DateTime baubeginn))
        {
            return Results.BadRequest("Format de date de début de construction invalide.");
        }
        
        // --- Création de l'objet ---
        var kunde = new Kunde
        {
            Name = name,
            Email = email,
            Telefonnummer = telefonnummer,
            Betreff = betreff,
            ProjektArt = projektArt,
            Baubeginn = baubeginn.Date(), // Hier wird der DateTime-Wert in UTC konvertiert
            ProjektBeschreibung = projektBeschreibung,
            Status = status
        };

        // --- Ajout et Sauvegarde ---
        db.Kunden.Add(kunde);
        await db.SaveChangesAsync();

        return Results.Ok("Client (Kunde) ajouté avec succès !");
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.InnerException?.Message);
        return Results.BadRequest(ex.InnerException?.Message ?? ex.Message);
    }
});
*/
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

// Démarre l'application
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}