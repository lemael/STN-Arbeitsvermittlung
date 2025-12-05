import {
  Alert,
  AlertTitle,
  Box,
  Button,
  // IMPORT MANQUANT AJOUTÉ ICI
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
// CORRECTION DU CHEMIN: Changement de '../Contexts/' à '../contexts/' (minuscule)
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useInboxContext } from "../../../contexts/InboxContext";
import KundeFormData from "../../../Models/Kunde";
import KundeDetailModal from "./KundeDetailModal";
import { formatDate, getBetreffChip, getStatusChip } from "./ServiceFunction";

function ApplicationsBoiteDeReception() {
  const [selectedKunde, setSelectedKunde] = useState<KundeFormData | null>(
    null
  );

  // Fonction maintenant sans 'export default' ici
  const theme = useTheme();
  // Récupération de l'erreur API
  const {
    newKunden,
    markAllAsRead,
    loadKundenFromApi,
    notificationCount,
    apiError,
  } = useInboxContext(); // <-- DÉSORMAIS apiError EST DISPONIBLE

  console.log(
    "DEBUG COMPONENT: Rendu de BoiteDeReception. Clients:",
    newKunden.length,
    "Erreur API:",
    apiError
  ); // <-- LOG DE DÉBOGAGE
  const handleRowClick = (kunde: KundeFormData) => {
    setSelectedKunde(kunde);
  };
  const handleCloseModal = () => {
    setSelectedKunde(null);
  };
  // Au chargement initial, on charge les données depuis l'API (si elles n'y sont pas déjà)
  useEffect(() => {
    console.log(
      "DEBUG COMPONENT: useEffect appelé. newKunden.length:",
      newKunden.length
    ); // <-- LOG DE DÉBOGAGE
    // Si la liste est vide (première connexion ou F5), on appelle l'API pour récupérer les données.
    if (newKunden.length === 0) {
      console.log("DEBUG COMPONENT: Déclenchement de loadKundenFromApi."); // <-- LOG DE DÉBOGAGE
      loadKundenFromApi();
    }
  }, [loadKundenFromApi]); // Fix: Utilisation de loadKundenFromApi comme dépendance

  // Définir la logique du contenu de la table
  const tableContent = () => {
    if (apiError) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ width: "100%" }}>
              <AlertTitle>Erreur de Chargement des Données</AlertTitle>
              {apiError} — Veuillez vérifier que le backend est en cours
              d'exécution et que l'URL d'API est correcte.
            </Alert>
            <Button
              onClick={loadKundenFromApi}
              sx={{ mt: 2 }}
              variant="outlined"
            >
              Réessayer de charger
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    // ... (Logique pour newKunden.length === 0 et affichage des données inchangée)
    if (newKunden.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Votre boîte de réception est vide.
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Les nouveaux formulaires de clients apparaîtront ici.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    // Affichage normal des données
    return newKunden.map((kunde) => (
      <TableRow
        key={kunde.id}
        onClick={() => handleRowClick(kunde)}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "&:hover": { bgcolor: theme.palette.action.hover },
          // Met en évidence les nouveaux clients non lus
          ...(newKunden.indexOf(kunde) < notificationCount && {
            bgcolor: theme.palette.info.light + "10",
            fontWeight: "bold",
          }),
        }}
      >
        <TableCell component="th" scope="row">
          {kunde.id}
        </TableCell>
        <TableCell>
          <Typography variant="body1" fontWeight="bold">
            {kunde.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {kunde.email}
          </Typography>
        </TableCell>
        <TableCell>{getBetreffChip(kunde.betreff)}</TableCell>
        <TableCell>{kunde.baubeginn}</TableCell>
        <TableCell>{getStatusChip(kunde.status!)}</TableCell>
        <TableCell>{formatDate(kunde.erstellungsZeit!)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Boîte de Réception ({newKunden.length} Clients)
        </Typography>
        {notificationCount > 0 && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ClearAllIcon />}
            onClick={markAllAsRead}
            disabled={notificationCount === 0}
          >
            Marquer {notificationCount} comme lu
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tableau des nouveaux clients">
          <TableHead sx={{ bgcolor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nom / Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Betreff
              </TableCell>

              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Début Construction
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Statut
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Reçu le
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableContent()}</TableBody>
        </Table>
      </TableContainer>
      {/* MODALE DÉTAILS DU CLIENT */}
      <KundeDetailModal kunde={selectedKunde} onClose={handleCloseModal} />
    </Container>
  );
}

// L'exportation par défaut explicite est plus sûre pour les imports dynamiques
export default ApplicationsBoiteDeReception;
