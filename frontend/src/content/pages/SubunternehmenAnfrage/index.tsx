import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  telefon: string;
  description: string;
  category: string;
};

const categories = ["Malerarbeiten", "Elektroinstallationen", "Bauplanung"];

export default function ServiceRequestForm(): React.ReactElement {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      telefon: "",
      description: "",
      category: "",
    },
  });

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      // Simuler envoi au serveur
      await new Promise((r) => setTimeout(r, 600));
      console.log("Form submitted:", data);
      setSnackbarMessage("Demande envoyée avec succès !");
      setOpenSnackbar(true);
      reset();
    } catch (e) {
      console.error(e);
      setSnackbarMessage("Erreur lors de l'envoi. Réessaie.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      maxWidth={760}
      mx="auto"
      p={2}
      sx={{ backgroundColor: "#fff", marginTop: 4 }}
    >
      <Typography variant="h5" mb={2} component="h1">
        Serviceanfrage
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name ist erforderlich" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email ist erforderlich",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Adresse email invalide",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="telefon"
          control={control}
          rules={{
            required: "Telefon ist erforderlich",
            minLength: { value: 6, message: "Numéro trop court" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Telefon"
              fullWidth
              error={!!errors.telefon}
              helperText={errors.telefon?.message}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          rules={{ required: "Wählen ein Auftrag" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-label">Auftragsart</InputLabel>
              <Select
                labelId="category-label"
                label="Auftragsart"
                {...field}
                value={field.value || ""}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name="description"
          control={control}
          rules={{ required: "Beschreibung ist erforderlich" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Beschreibung"
              fullWidth
              multiline
              minRows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Anfrage senden
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
