using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Ajouté pour l'attribut Column
using System;
using System.Text.Json.Serialization;
using backend.Services;

namespace backend.Models;



/// <summary>
/// Énumération pour le domaine d'expertise (Fachgebiet) d'un sous-traitant.
/// </summary>
public enum Fachgebiet
{
    Elektrik,
    Rohbau,
    Sanitär,
    Maler,
    Dachdecker
}

/// <summary>
/// Énumération pour la forme juridique de l'entreprise.
/// </summary>
public enum Rechtsform
{
    Einzelunternehmen,
    Personengesellschaften,
    Kapitalgesellschaften
}

/// <summary>
/// Modèle de données pour les sous-traitants (Subunternehmer).
/// </summary>
public class Subunternehmer
{
    [Key]
    public int Id { get; set; }  // Clé primaire

    // Informations Générales
    [Required(ErrorMessage = "Firmenname ist erforderlich")]
    [StringLength(150)]
    public string Firmenname { get; set; } = string.Empty; // obligatoire

    [Required(ErrorMessage = "Ansprechpartnername ist erforderlich")]
    [StringLength(100)]
    public string Ansprechpartnername { get; set; } = string.Empty; // obligatoire

    [Required(ErrorMessage = "Adresse ist erforderlich")]
    public string Adresse { get; set; } = string.Empty; // obligatoire

    [Required(ErrorMessage = "Telefonnummer ist erforderlich")]
    [Phone(ErrorMessage = "Ungültige Telefonnummer")]
    public string Telefonnummer { get; set; } = string.Empty; // obligatoire

    [Required(ErrorMessage = "Email ist erforderlich")]
    [EmailAddress(ErrorMessage = "Ungültige Email-Adresse")]
    public string Email { get; set; } = string.Empty; // obligatoire

    // Expertise et Qualification
    [Required(ErrorMessage = "Fachgebiet ist erforderlich")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Fachgebiet Fachgebiet { get; set; } // obligatoire (choix dans la liste)

    [Required(ErrorMessage = "Qualifikationen (Dokument/Zertifikat) sind erforderlich")]
    // NOTE: En réalité, ce serait un chemin d'accès à un fichier, mais nous le traitons comme un champ de texte ici.
    public string Qualificationen { get; set; } = string.Empty; // obligatoire (chemin d'accès ou description)

    [Required(ErrorMessage = "Erfahrung ist erforderlich")]
    [StringLength(1000, ErrorMessage = "Beschreibung der Erfahrung darf nicht länger als 1000 Zeichen sein")]
    public string Erfarung { get; set; } = string.Empty; // obligatoire (courte description)

    // Disponibilité et Région
    [Required(ErrorMessage = "Verfügbarkeitsdatum ist erforderlich")]
    [DataType(DataType.Date, ErrorMessage = "Ungültiges Datum")]
    public DateOnly Verfügbarkeitdatum { get; set; } // obligatoire

    [Required(ErrorMessage = "Arbeitsregionen sind erforderlich")]
    // NOTE: Stocké comme une chaîne de caractères séparée par des virgules (ex: "Bayern,Niedersachsen")
   
    public string Arbeitsregionen { get; set; } = string.Empty; // obligatoire (sélection multiple)

    [Required(ErrorMessage = "Anzahl der Mitarbeiter ist erforderlich")]
    public int AnzahlDerMitarbeiter { get; set; } // obligatoire

    // Finances et Légal
    [Required(ErrorMessage = "Umsatzsteuer-Identifikationsnummer ist erforderlich")]
    [StringLength(20)]
    public string UmsatznsteuerIdentifikationsnummer { get; set; } = string.Empty; // obligatoire
    
    [Required(ErrorMessage = "Rechtsform ist erforderlich")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Rechtsform RechtsformDesUnternehmens { get; set; } // obligatoire (choix dans la liste)

    // Informations d'Assurance (Combinées en un seul champ pour la simplicité du modèle)
    [Required(ErrorMessage = "Angaben zum Versicherungsschutz sind erforderlich")]
    public string Versicherungsschutz { get; set; } = string.Empty; // obligatoire (Nom assureur, Couverture, Durée)

    // Informations Bancaires (Combinées en un seul champ pour la simplicité du modèle)
    [Required(ErrorMessage = "Bankverbindung ist erforderlich")]
    public string Bankverbindung { get; set; } = string.Empty; // obligatoire (Nom et IBAN)
    
    // Remarques optionnelles
    public string Sonstige { get; set; } = string.Empty; // optionnel
    
    // Colonne pour l'horodatage de création (facultatif mais utile)
    public DateTime ErstellungsZeit { get; set; } = DateTime.UtcNow;
}