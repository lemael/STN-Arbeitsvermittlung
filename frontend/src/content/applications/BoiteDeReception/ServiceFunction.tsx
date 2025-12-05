import { Chip } from "@mui/material";
import Betreff from "../../../types/BetreffType";
import Status from "../../../types/StatusType";

// Fonction utilitaire pour le formatage de la date
export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  // Correction pour s'assurer que dateString est de type string avant d'appeler toLocaleString
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date Invalide";
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonction utilitaire pour le statut Chip
export const getStatusChip = (status: Status) => {
  switch (status) {
    case "Prüfphase":
      return <Chip label="En Attente" color="warning" size="small" />;
    case "NichtAkzeptiert":
      return <Chip label="Rejeté" color="error" size="small" />;
    case "Laufende":
      return <Chip label="En Cours" color="success" size="small" />;
    case "Ende":
      return <Chip label="Terminé" color="default" size="small" />;
    default:
      return <Chip label="Nouveau" color="primary" size="small" />;
  }
};

// NOUVELLE FONCTION: Fonction utilitaire pour le Betreff Chip
export const getBetreffChip = (betreff: Betreff) => {
  switch (betreff) {
    case "Neubau":
      return (
        <Chip
          label="Nouvelle Construction"
          color="info"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    case "Sanierung":
      return (
        <Chip
          label="Rénovation"
          color="secondary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    case "Beratung":
      return (
        <Chip
          label="Consultation"
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    case "Angebot":
      return (
        <Chip
          label="Devis / Offre"
          color="success"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    case "Sonstiges":
      return (
        <Chip
          label="Autre"
          color="default"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      );
    default:
      return <Chip label="Non Défini" color="error" size="small" />;
  }
};
