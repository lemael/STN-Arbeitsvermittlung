import { Fachgebiet } from "../types/Fachgebiet";
import { Rechtsform } from "../types/Rechtsform";

interface SubunternehmerFormData {
  // Informations Générales
  id?: number; // Optionnel côté client si c'est un nouveau formulaire
  firmenname: string; // obligatoire
  ansprechpartnername: string; // obligatoire
  adresse: string; // obligatoire
  telefonnummer: string; // obligatoire
  email: string; // obligatoire

  // Expertise et Qualification
  fachgebiet: Fachgebiet; // obligatoire (choix dans la liste)
  qualifikationen: string; // obligatoire (chemin d'accès au document / description)
  erfarung: string; // obligatoire (courte description)

  // Disponibilité et Région
  verfügbarkeitdatum: string; // obligatoire (Date au format string ISO 8601, ex: "YYYY-MM-DD")
  anzahlDerMitarbeiter: number; // obligatoire
  // Stocké comme une chaîne de caractères séparée par des virgules dans le backend C#, mais géré
  // comme un tableau de chaînes dans le frontend pour la sélection multiple.
  arbeitsregionen: string;

  // Finances et Légal
  umsatznsteuerIdentifikationsnummer: string; // obligatoire
  rechtsformDesUnternehmens: Rechtsform; // obligatoire (choix dans la liste)

  // Assurance (Contient le nom de l'assureur, la couverture et la durée)
  versicherungsschutz: string; // obligatoire

  // Informations Bancaires (Contient le nom et l'IBAN)
  bankverbindung: string; // obligatoire

  // Remarques optionnelles
  sonstige?: string; // optionnel

  // Horodatage de création (généré côté serveur, mais potentiellement lu par le client)
  erstellungsZeit?: string;
}

export default SubunternehmerFormData;
