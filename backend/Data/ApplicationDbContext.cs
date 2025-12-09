using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace backend.Data;
public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
{
    public DateOnlyConverter() : base(
        d => d.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
        d => DateOnly.FromDateTime(d))
    { }
}

public class DateOnlyComparer : ValueComparer<DateOnly>
{
    public DateOnlyComparer() : base(
        (d1, d2) => d1 == d2,
        d => d.GetHashCode())
    { }
}
public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
{
}

    public DbSet<Kunde> Kunden => Set<Kunde>();
    public DbSet<Subunternehmer> Subunternehmer => Set<Subunternehmer>(); 
   
   
   protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Kunde>(entity =>
    {
        entity.ToTable("Kunden");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("Id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.Name)
            .HasColumnName("Name")
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(e => e.Email)
            .HasColumnName("Email")
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(e => e.Telefonnummer)
            .HasColumnName("Telefonnummer")
            .HasMaxLength(20);

        entity.Property(e => e.Betreff)
            .HasColumnName("Betreff")
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (Betreff)Enum.Parse(typeof(Betreff), v));

        entity.Property(e => e.ProjektArt)
            .HasColumnName("ProjektArt")
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (ProjektArt)Enum.Parse(typeof(ProjektArt), v));

         entity.Property(e => e.Baubeginn)
            .HasColumnName("Baubeginn")
            .IsRequired()
            // Pas besoin de conversion explicite pour DateOnly, EF Core/Npgsql le gère
            // automatiquement en mappant à la colonne PostgreSQL 'date'.
            .HasColumnType("date"); 

        entity.Property(e => e.ProjektBeschreibung)
            .HasColumnName("ProjektBeschreibung")
            .IsRequired()
            .HasMaxLength(500);

        entity.Property(e => e.Status)
            .HasColumnName("Status")
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (Status)Enum.Parse(typeof(Status), v));
        
         entity.Property(e => e.ErstellungsZeit)
            .HasColumnName("ErstellungsZeit")
            .IsRequired()
            .HasColumnType("timestamp");
    });

     modelBuilder.Entity<Subunternehmer>(entity =>
    {
        entity.ToTable("Subunternehmer"); // Nom de la table dans la base de données
        entity.HasKey(e => e.Id);

        // Conversion des Enums en Chaînes pour le stockage DB
        entity.Property(e => e.Fachgebiet)
            .HasColumnName("Fachgebiet")
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (Fachgebiet)Enum.Parse(typeof(Fachgebiet), v));

        entity.Property(e => e.RechtsformDesUnternehmens)
            .HasColumnName("RechtsformDesUnternehmens")
            .IsRequired()
            .HasConversion(
                v => v.ToString(),
                v => (Rechtsform)Enum.Parse(typeof(Rechtsform), v));
        
        // Configuration de la colonne Arbeitsregionen comme chaîne (jusqu'à 500 caractères)
        entity.Property(e => e.Arbeitsregionen)
            .HasColumnName("Arbeitsregionen")
            .IsRequired()
            .HasMaxLength(500);
            
        // Le reste des propriétés sera automatiquement mappé par convention.
        entity.Property(s => s.Verfügbarkeitdatum)
            .HasConversion<DateOnlyConverter, DateOnlyComparer>();

    });
}
}