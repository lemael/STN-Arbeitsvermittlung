import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import KundeFormData from "../../../Models/Kunde";
import { formatDate, getStatusChip } from "./ServiceFunction";

interface KundeDetailModalProps {
  kunde: KundeFormData | null;
  onClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600, md: 800 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const KundeDetailModal: React.FC<KundeDetailModalProps> = ({
  kunde,
  onClose,
}) => {
  const theme = useTheme();

  if (!kunde) return null;

  return (
    <Modal
      open={!!kunde}
      onClose={onClose}
      aria-labelledby="client-detail-title"
      aria-describedby="client-detail-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            id="client-detail-title"
            variant="h5"
            component="h2"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Détails du Client: {kunde.name}
          </Typography>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          id="client-detail-description"
          mb={3}
          p={2}
          sx={{ bgcolor: theme.palette.grey[100], borderRadius: 1 }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {kunde.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Téléphone:</strong> {kunde.telefonnummer || "Non spécifié"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Objet (Betreff):</strong>{" "}
            <Chip label={kunde.betreff} color="primary" size="small" />
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Type de Projet (ProjektArt):</strong>{" "}
            <Chip label={kunde.projektArt} color="secondary" size="small" />
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Début de Construction (Baubeginn):</strong>{" "}
            {kunde.baubeginn}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {kunde.status && (
              <Box component="span">
                <strong>Statut:</strong> {getStatusChip(kunde.status)}
              </Box>
            )}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {kunde.erstellungsZeit && (
              <Box component="span">
                <strong>Reçu le:</strong> {formatDate(kunde.erstellungsZeit)}
              </Box>
            )}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          color={theme.palette.text.primary}
        >
          Description du Projet (ProjektBeschreibung)
        </Typography>
        <Paper
          elevation={1}
          sx={{ p: 2, bgcolor: theme.palette.background.default }}
        >
          <Typography variant="body1" whiteSpace="pre-wrap">
            {kunde.projektBeschreibung}
          </Typography>
        </Paper>
      </Box>
    </Modal>
  );
};

export default KundeDetailModal;
