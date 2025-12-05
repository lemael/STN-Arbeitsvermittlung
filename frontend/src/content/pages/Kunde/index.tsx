import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useInboxContext } from "../../../contexts/InboxContext";
import KundeFormData from "../../../Models/Kunde";
import Betreff from "../../../types/BetreffType";
import ProjektArt from "../../../types/ProjektArtType";

// =================================================================
// 1. TYPESCRIPT INTERFACES ET ENUMS (doivent correspondre à Kunde.cs)
// =================================================================

// Liste des options pour les Select inputs
const BetreffOptions: Betreff[] = [
  "Neubau",
  "Sanierung",
  "Beratung",
  "Angebot",
  "Sonstiges",
];
const ProjektArtOptions: ProjektArt[] = [
  "Wohnungsbau",
  "Gewerbebau",
  "ÖffentlicheBauprojekte",
  "Sonderbauten",
  "Infrastruktur",
];

// État initial du formulaire
const initialFormData: KundeFormData = {
  name: "",
  email: "",
  telefonnummer: "",
  betreff: "Neubau",
  projektArt: "Wohnungsbau",
  baubeginn: new Date().toISOString().split("T")[0], // Aujourd'hui, format YYYY-MM-DD
  projektBeschreibung: "",
};

// =================================================================
// 2. COMPOSANT PRINCIPAL
// =================================================================

// REMPLACER PAR VOTRE URL RENDER EN PRODUCTION
const API_ENDPOINT = "http://localhost:5054/add-kunde";

export default function KundenFormular() {
  const { loadKundenFromApi } = useInboxContext();
  const [formData, setFormData] = useState<KundeFormData>(initialFormData);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Gère les changements de tous les champs
  const handleChange = (
    // Signature corrigée: Accepte les types standards ET le type SelectChangeEvent de MUI.
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Validation simple
  const isFormValid = useMemo(() => {
    const requiredFields: Array<keyof KundeFormData> = [
      "name",
      "email",
      "betreff",
      "projektArt",
      "baubeginn",
      "projektBeschreibung",
    ];
    return requiredFields.every((field) => {
      // CORRECTION TS2532: Extrait la valeur et utilise String() pour
      // garantir qu'elle est traitable comme une chaîne, tout en conservant
      // la vérification de vérité (pour exclure null/undefined/"" si la vérification de vérité échoue).
      const value = formData[field];
      return value && String(value).trim() !== "";
    });
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setStatusMessage({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires (*).",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({
      type: "info",
      message: "Envoi des données en cours...",
    });

    try {
      const payload = {
        Name: formData.name,
        Email: formData.email,
        Telefonnummer: formData.telefonnummer,
        Betreff: formData.betreff,
        ProjektArt: formData.projektArt,
        Baubeginn: formData.baubeginn,
        ProjektBeschreibung: formData.projektBeschreibung,
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: "Client (Kunde) ajouté avec succès !",
        });
        // --- LOGIQUE AJOUTÉE ICI ---
        // 1. Ajouter le nouveau client au contexte global
        // On utilise la date actuelle comme date de réception.
        await loadKundenFromApi();
        setFormData(initialFormData);
      } else {
        const errorText = await response.text();
        setStatusMessage({
          type: "error",
          message: `Échec de l'ajout: ${errorText || response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Erreur réseau ou d'API:", error);
      setStatusMessage({
        type: "error",
        message: "Erreur de connexion au serveur. Vérifiez l'URL de l'API.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // 3. RENDER (Material-UI)
  // =================================================================

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ py: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}
    >
      <Box
        sx={{
          mt: 4,
          p: { xs: 3, md: 5 },
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 8,
          borderTop: "5px solid #3f51b5",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#3f51b5" }}
        >
          Nouveau Client (Kunde) - Formulaire
        </Typography>

        {statusMessage && (
          <Alert
            severity={
              statusMessage.type === "success"
                ? "success"
                : statusMessage.type === "error"
                  ? "error"
                  : "info"
            }
            sx={{ mb: 3 }}
          >
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {statusMessage.type === "success" ? "Succès" : "Erreur"} :
            </Typography>{" "}
            {statusMessage.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            {/* Name */}
            <div style={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                label="Nom *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </div>

            {/* Email */}
            <div style={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </div>

            {/* Telefonnummer */}
            <div style={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                label="Téléphone (Optionnel)"
                name="telefonnummer"
                type="tel"
                value={formData.telefonnummer}
                onChange={handleChange}
                variant="outlined"
              />
            </div>

            {/* Baubeginn */}
            <div style={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                label="Date de Début de Construction (Baubeginn) *"
                name="baubeginn"
                type="date"
                value={formData.baubeginn}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>

            {/* Betreff */}
            <div style={{ flex: "1 1 300px" }}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                color="primary"
              >
                <InputLabel id="betreff-label">Objet (Betreff) *</InputLabel>
                <Select
                  labelId="betreff-label"
                  id="betreff"
                  name="betreff"
                  value={formData.betreff}
                  onChange={handleChange}
                  label="Objet (Betreff) *"
                >
                  {BetreffOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* ProjektArt */}
            <div style={{ flex: "1 1 300px" }}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                color="primary"
              >
                <InputLabel id="projektArt-label">
                  Type de Projet (ProjektArt) *
                </InputLabel>
                <Select
                  labelId="projektArt-label"
                  id="projektArt"
                  name="projektArt"
                  value={formData.projektArt}
                  onChange={handleChange}
                  label="Type de Projet (ProjektArt) *"
                >
                  {ProjektArtOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* ProjektBeschreibung */}
            <div style={{ flex: "1 1 100%" }}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                color="primary"
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ mb: 1, color: "text.secondary", fontWeight: 500 }}
                >
                  Description du Projet (ProjektBeschreibung) *
                </Typography>

                <TextareaAutosize
                  id="projektBeschreibung"
                  name="projektBeschreibung"
                  value={formData.projektBeschreibung}
                  onChange={handleChange}
                  minRows={4}
                  maxLength={500}
                  placeholder="Décrivez votre projet en détail (max 500 caractères)..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    borderColor: "#bdbdbd",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: "16px",
                    lineHeight: 1.5,
                    resize: "vertical",
                  }}
                  required
                />

                <FormHelperText>
                  {formData.projektBeschreibung.length} / 500 caractères
                </FormHelperText>
              </FormControl>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !isFormValid}
              endIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              {loading
                ? "Envoi..."
                : "Ajouter le Client (Kunde) à la Base de Données"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
