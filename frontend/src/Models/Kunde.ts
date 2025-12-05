import Betreff from "../types/BetreffType";
import ProjektArt from "../types/ProjektArtType";

interface KundeFormData {
  name: string;
  email: string;
  telefonnummer: string; // Optionnel
  betreff: Betreff;
  projektArt: ProjektArt;
  baubeginn: string; // Sera envoyé comme string ISO 8601
  projektBeschreibung: string;
  // Status n'est pas inclus car il a une valeur par défaut 'Prüfphase' et est géré par le backend.
}
export default KundeFormData;
