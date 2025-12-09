import Subunternehmer from "../Models/Subunternehmer";
import { Fachgebiet } from "../types/Fachgebiet";
import { Rechtsform } from "../types/Rechtsform";
const initialFormState: Subunternehmer = {
  firmenname: "",
  ansprechpartnername: "",
  adresse: "",
  telefonnummer: "",
  email: "",
  fachgebiet: "Rohbau" as Fachgebiet,
  qualifikationen: "",
  erfarung: "",
  // Standardmäßig das heutige Datum im YYYY-MM-DD-Format
  verfügbarkeitdatum: new Date().toISOString().split("T")[0],
  anzahlDerMitarbeiter: 0,
  arbeitsregionen: "", // Array von Strings
  umsatznsteuerIdentifikationsnummer: "",
  rechtsformDesUnternehmens: "" as Rechtsform,
  versicherungsschutz: "",
  bankverbindung: "",
  sonstige: "",
};

export default initialFormState;
