using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
{
}

    public DbSet<Kunde> Kunden => Set<Kunde>();
   
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
    });
}
}