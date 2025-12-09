import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import FormField from "../../../components/SubunternehmerFormular/FormField";
import API_ENDPOINT from "../../../constants/apiEndpoint_subunternehmer";
import { ArbeitsregionenList } from "../../../constants/ArbeitsregionenList";
import FachgebietOptions from "../../../constants/FachgebietOptions";
import initialFormState from "../../../constants/initialFormState_Subunternehmer";
import RechtsformOptions from "../../../constants/RechtsformOptions";
import {
  default as Subunternehmer,
  default as SubunternehmerFormData,
} from "../../../Models/Subunternehmer";
import { Fachgebiet } from "../../../types/Fachgebiet";
import { Rechtsform } from "../../../types/Rechtsform";

type StatusType = "success" | "error" | "info";
type StatusMessageType = { type: StatusType; message: string } | null;

type FormErrors = Partial<Record<keyof Subunternehmer, string>>;
const SubunternehmerFormular: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<Subunternehmer>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessageType>(null);

  // ------------------- Logik zur Fehlerberechnung -------------------
  const calculateErrors = useCallback((data: Subunternehmer): FormErrors => {
    const newErrors: FormErrors = {};

    const requiredFields: (keyof Subunternehmer)[] = [
      "firmenname",
      "ansprechpartnername",
      "adresse",
      "telefonnummer",
      "email",
      "fachgebiet",
      "qualifikationen",
      "erfarung",
      "verfügbarkeitdatum",
      "anzahlDerMitarbeiter",
      "umsatznsteuerIdentifikationsnummer",
      "rechtsformDesUnternehmens",
      "versicherungsschutz",
      "bankverbindung",
    ];

    requiredFields.forEach((field) => {
      const value = data[field];

      if (field === "anzahlDerMitarbeiter") {
        if (typeof value === "number" && value <= 0) {
          newErrors[field] = "Die Anzahl muss größer als 0 sein";
        }
      } else if (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "")
      ) {
        newErrors[field] = "Dieses Feld ist obligatorisch";
      }
    });

    if (data.arbeitsregionen.length === 0) {
      newErrors.arbeitsregionen = "Bitte wählen Sie mindestens eine Region aus";
    }

    return newErrors;
  }, []);

  // Verwenden Sie useMemo, um Fehler und Validität auf der Grundlage von formData zu berechnen
  const errors = useMemo(
    () => calculateErrors(formData),
    [formData, calculateErrors]
  );

  // Funktion zum Aktualisieren von Text- und Zahlenfeldern
  const handleChange = (
    // Signature corrigée: Accepte les types standards ET le type SelectChangeEvent de MUI.
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funktion zum Aktualisieren einfacher Auswahlfelder (Enum)
  const handleSelectChange = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as Fachgebiet | Rechtsform,
    }));
  }, []);

  // Funktion zum Aktualisieren der Mehrfachauswahl von Regionen
  const handleRegionsChange = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as string,
    }));
  }, []);
  const isFormValid = useMemo(() => {
    const requiredFields: Array<keyof SubunternehmerFormData> = [
      "firmenname",
      "ansprechpartnername",
      "adresse",
      "telefonnummer",
      "email",
      "fachgebiet",
      "qualifikationen",
      "erfarung",
      "verfügbarkeitdatum",
      "anzahlDerMitarbeiter",
      "umsatznsteuerIdentifikationsnummer",
      "rechtsformDesUnternehmens",
      "versicherungsschutz",
      "bankverbindung",
      "arbeitsregionen",
    ];
    return requiredFields.every((field) => {
      // CORRECTION TS2532: Extrait la valeur et utilise String() pour
      // garantir qu'elle est traitable comme une chaîne, tout en conservant
      // la vérification de vérité (pour exclure null/undefined/"" si la vérification de vérité échoue).
      const value = formData[field];
      return value && String(value).trim() !== "";
    });
  }, [formData]);

  // Funktion zum Senden des Formulars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      // Wenn die Formularvalidierung fehlschlägt, setzen Sie eine Fehlermeldung
      setStatusMessage({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires (*).",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({
      type: "info",
      message: "Übermittlung der Daten läuft...",
    });

    try {
      // SICHERE PAYLOAD-ERSTELLUNG: OMITTIERT ""
      const payload = {
        Firmenname: formData.firmenname,
        AnsprechpartnerName: formData.ansprechpartnername,
        Adresse: formData.adresse,
        Fachgebiet: formData.fachgebiet,
        RechtsformDesUnternehmens: formData.rechtsformDesUnternehmens,
        Qualifikationen: formData.qualifikationen,
        Erfahrung: formData.erfarung,
        UmsatzsteuerIdentifikationsnummer:
          formData.umsatznsteuerIdentifikationsnummer,
        AnzahlDerMitarbeiter: formData.anzahlDerMitarbeiter,
        Verfügbarkeitdatum: formData.verfügbarkeitdatum,
        Arbeitsregionen: formData.arbeitsregionen,
        Versicherungsschutz: formData.versicherungsschutz,
        Bankverbindung: formData.bankverbindung,
        Sonstige: formData.sonstige,
        Telefonnummer: formData.telefonnummer,
        Email: formData.email,
      };
      console.log("Request Body:", JSON.stringify(payload));

      // SIMULIERT:
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message:
            "Erfolgreich eingereicht! Der Subunternehmer wurde dem System hinzugefügt.",
        });
        setFormData(initialFormState); // Formular zurücksetzen
      } else {
        let detail = response.statusText;
        try {
          const errorData = await response.json();
          detail = errorData.title || response.statusText;
        } catch {}

        setStatusMessage({
          type: "error",
          message: `Fehler beim Senden: ${detail}. Code: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("Netzwerk- oder Übermittlungsfehler:", error);
      setStatusMessage({
        type: "error",
        message:
          "Verbindungsfehler zum Server. Bitte überprüfen Sie Ihr Netzwerk.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hilfs-Stile
  const fullWidthItemStyle = useMemo(
    () => ({
      flexBasis: "100%",
      p: 1.5,
      boxSizing: "border-box",
    }),
    []
  );

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexWrap: "wrap",
      m: -1.5,
      "& > *": {
        mt: 1.5,
      },
    }),
    []
  );

  // Hilfsfunktion zur Ermittlung der Farbe des Statusmeldungsrahmens
  const getStatusColor = (type: StatusType) => {
    switch (type) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "auto" }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Formular zur Registrierung von Subunternehmern (Subunternehmer)
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={containerStyle}>
              {/* Section 1: Allgemeine Informationen */}
              <Box sx={fullWidthItemStyle}>
                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                  Allgemeine Informationen
                </Typography>
              </Box>

              <FormField
                label="Firmenname (Unternehmensname)"
                name="firmenname"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                isMobile={isMobile}
              />
              <FormField
                label="Ansprechpartnername (Kontaktname)"
                name="ansprechpartnername"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                isMobile={isMobile}
              />
              <FormField
                label="Adresse"
                name="adresse"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isMobile={isMobile}
              />
              <FormField
                label="Telefonnummer (Telefonnummer)"
                name="telefonnummer"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                isMobile={isMobile}
              />
              <FormField
                label="Email"
                name="email"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                type="email"
                isMobile={isMobile}
              />

              {/* Section 2: Expertise und Rechtliches */}
              <Box sx={fullWidthItemStyle}>
                <Typography variant="h5" color="primary" sx={{ my: 1 }}>
                  Expertise und Rechtliches
                </Typography>
              </Box>

              {/* Fachgebiet Select */}
              <Box
                sx={{
                  flexBasis: isMobile ? "100%" : "50%",
                  p: 1.5,
                  boxSizing: "border-box",
                }}
              >
                <FormControl fullWidth required error={!!errors.fachgebiet}>
                  <InputLabel id="fachgebiet-label">
                    Fachgebiet (Bereich)
                  </InputLabel>
                  <Select
                    labelId="fachgebiet-label"
                    label="Fachgebiet (Bereich) *"
                    name="fachgebiet"
                    value={formData.fachgebiet}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="" disabled>
                      Wählen Sie ein Fachgebiet
                    </MenuItem>
                    {FachgebietOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.fachgebiet && (
                    <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                      {errors.fachgebiet}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Rechtsform Select */}
              <Box
                sx={{
                  flexBasis: isMobile ? "100%" : "50%",
                  p: 1.5,
                  boxSizing: "border-box",
                }}
              >
                <FormControl
                  fullWidth
                  required
                  error={!!errors.rechtsformDesUnternehmens}
                >
                  <InputLabel id="rechtsform-label">
                    Rechtsform des Unternehmens
                  </InputLabel>
                  <Select
                    labelId="rechtsform-label"
                    label="Rechtsform des Unternehmens *"
                    name="rechtsformDesUnternehmens"
                    value={formData.rechtsformDesUnternehmens}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="" disabled>
                      Wählen Sie eine Rechtsform
                    </MenuItem>
                    {RechtsformOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.rechtsformDesUnternehmens && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {errors.rechtsformDesUnternehmens}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <FormField
                label="Qualifikationen (Beschreibung oder Link zum Dokument)"
                name="qualifikationen"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isMobile={isMobile}
              />
              <FormField
                label="Erfahrung (Beschreibung relevanter Projekte)"
                name="erfarung"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                rows={3}
                isMobile={isMobile}
              />
              <FormField
                label="Umsatzsteuer-Identifikationsnummer (USt-IdNr.)"
                name="umsatznsteuerIdentifikationsnummer"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                isMobile={isMobile}
              />
              <FormField
                label="Anzahl der Mitarbeiter (Anzahl der Mitarbeiter)"
                name="anzahlDerMitarbeiter"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                type="number"
                isMobile={isMobile}
              />

              {/* Section 3: Verfügbarkeit, Regionen und Finanzen */}
              <Box sx={fullWidthItemStyle}>
                <Typography variant="h5" color="primary" sx={{ my: 1 }}>
                  Verfügbarkeit und Finanzen
                </Typography>
              </Box>

              {/* Verfügbarkeitsdatum (als einfacher Datums-Textfeld-Typ) */}
              <FormField
                label="Verfügbarkeitdatum (Verfügbarkeitsdatum)"
                name="verfügbarkeitdatum"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isHalfWidth
                type="date"
                isMobile={isMobile}
              />

              {/* Arbeitsregionen Select */}
              <Box
                sx={{
                  flexBasis: isMobile ? "100%" : "50%",
                  p: 1.5,
                  boxSizing: "border-box",
                }}
              >
                <FormControl
                  fullWidth
                  required
                  error={!!errors.arbeitsregionen}
                >
                  <InputLabel id="regions-label">
                    Arbeitsregionen (Arbeitsregionen)
                  </InputLabel>
                  <Select
                    labelId="regions-label"
                    label="Arbeitsregionen (Arbeitsregionen) *"
                    name="arbeitsregionen"
                    value={formData.arbeitsregionen}
                    onChange={handleRegionsChange}
                  >
                    {ArbeitsregionenList.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.arbeitsregionen && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {errors.arbeitsregionen}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <FormField
                label="Versicherungsschutz (Name des Versicherers, Deckung, Laufzeit)"
                name="versicherungsschutz"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                rows={2}
                isMobile={isMobile}
              />
              <FormField
                label="Bankverbindung (Name der Bank und IBAN)"
                name="bankverbindung"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isMobile={isMobile}
              />

              {/* Section 4: Sonstige Bemerkungen */}
              <Box sx={fullWidthItemStyle}>
                <Typography variant="h5" color="primary" sx={{ my: 1 }}>
                  Sonstige Bemerkungen (Optional)
                </Typography>
              </Box>
              <FormField
                label="Sonstige (Bemerkungen)"
                name="sonstige"
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                rows={2}
                isMobile={isMobile}
              />

              {/* Submit Button und Status */}
              <Box sx={{ flexBasis: "100%", mt: 3, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {loading
                    ? "Übermittlung läuft..."
                    : "Subunternehmer Speichern"}
                </Button>
              </Box>

              {/* Status Message */}
              {statusMessage && (
                <Box
                  sx={{
                    flexBasis: "100%",
                    textAlign: "center",
                    mt: 2,
                    p: 1.5,
                    border: 1,
                    borderColor: getStatusColor(statusMessage.type),
                    borderRadius: 1,
                    backgroundColor:
                      statusMessage.type === "error"
                        ? "error.light"
                        : "transparent",
                  }}
                >
                  <Typography
                    color={getStatusColor(statusMessage.type)}
                    fontWeight="bold"
                  >
                    {statusMessage.message}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubunternehmerFormular;
