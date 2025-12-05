using System.ComponentModel.DataAnnotations;
namespace backend.Models;

public enum Betreff
{
    Neubau,
    Sanierung,
    Beratung,
    Angebot,
    Sonstiges
}

public enum ProjektArt
{
    Wohnungsbau,
    Gewerbebau,
    ÖffentlicheBauprojekte,
    Sonderbauten,
    Infrastruktur
}

public enum Status
{
    Prüfphase,
    NichtAkzeptiert,
    Laufende,
    Ende
}

public class Kunde
{
    [Key]
    public int Id { get; set; }  // Primary Key

    [Required(ErrorMessage = "Name ist erforderlich")]
    [StringLength(100, ErrorMessage = "Name darf nicht länger als 100 Zeichen sein")]
    public string Name { get; set; }= string.Empty; // pflichtfeld

    [Required(ErrorMessage = "Email ist erforderlich")]
    [EmailAddress(ErrorMessage = "Ungültige Email-Adresse")]
    public string Email { get; set; }= string.Empty; // pflichtfeld

    [Phone(ErrorMessage = "Ungültige Telefonnummer")]
    public string Telefonnummer { get; set; }= string.Empty; //optional

    [Required(ErrorMessage = "Betreff ist erforderlich")]
    public Betreff Betreff { get; set; } // pflichtfeld

    [Required(ErrorMessage = "ProjektArt ist erforderlich")]
    public ProjektArt ProjektArt { get; set; } // pflichtfeld

    [Required(ErrorMessage = "Baubeginn ist erforderlich")]
    // Utiliser DateOnly au lieu de DateTime pour ne pas avoir de composante heure
    [DataType(DataType.Date, ErrorMessage = "Ungültiges Datum")]
    public DateOnly Baubeginn { get; set; } // pflichtfeld
    
    [Required(ErrorMessage = "ProjektBeschreibung ist erforderlich")]
    [StringLength(500, ErrorMessage = "ProjektBeschreibung darf nicht länger als 500 Zeichen sein")]
    public string ProjektBeschreibung { get; set; }= string.Empty; // pflichtfeld
    
    public Status Status { get; set; } = Status.Prüfphase;
}