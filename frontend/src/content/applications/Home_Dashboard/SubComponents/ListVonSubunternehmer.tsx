import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { formatDate } from "../../../../services/formatDate";

// Import du hook et du type réel depuis le contexte
import {
  SubunternehmerWithId,
  useSubunternehmerContext,
} from "../../../../contexts/SubunternehmerContext";

type Subunternehmer = SubunternehmerWithId;

export function ListVonSubunternehmer({ height }: { height: number }) {
  // 1. UTILISATION DU CONTEXTE
  const { subunternehmerList, loadSubunternehmerFromApi, apiError } =
    useSubunternehmerContext();

  const [selectedSubunternehmer, setSelectedSubunternehmer] =
    useState<Subunternehmer | null>(null);

  // 2. CHARGEMENT DES DONNÉES AU MONTAGE DU COMPOSANT
  useEffect(() => {
    // Si la liste est vide (première charge), on déclenche l'appel API
    if (subunternehmerList.length === 0 && !apiError) {
      loadSubunternehmerFromApi();
    }
  }, [loadSubunternehmerFromApi, subunternehmerList.length, apiError]);
  console.log(
    "Liste des sous-traitants chargée :",
    subunternehmerList.length,
    "éléments.",
    subunternehmerList
  );

  /**
   * CORRECTION MAJEURE:
   * La logique de bascule pour sélectionner/désélectionner l'élément est maintenant plus simple.
   */
  const handleCardClick = (subunternehmer: Subunternehmer) => {
    // Si l'élément cliqué est déjà sélectionné (on compare les IDs), on le désélectionne.
    if (selectedSubunternehmer?.id === subunternehmer.id) {
      setSelectedSubunternehmer(null);
    } else {
      // Sinon, on sélectionne le nouvel élément.
      setSelectedSubunternehmer(subunternehmer);
    }
  };

  const listWidth = selectedSubunternehmer ? "50%" : "100%";
  const isLoading = subunternehmerList.length === 0 && !apiError;

  // ----------------------------------------------------
  // GESTION DES ÉTATS D'ERREUR ET DE CHARGEMENT
  // ----------------------------------------------------

  if (apiError) {
    return (
      <Box
        sx={{
          p: 3,
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="error">
          <Typography variant="h6">Erreur de chargement de l'API</Typography>
          {apiError}
          <br />
          <Typography
            variant="body2"
            sx={{ mt: 1, cursor: "pointer" }}
            onClick={loadSubunternehmerFromApi}
          >
            Cliquez ici pour réessayer.
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Chargement des sous-traitants...
        </Typography>
      </Box>
    );
  }

  if (subunternehmerList.length === 0 && !isLoading && !apiError) {
    return (
      <Box
        sx={{
          p: 3,
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="info">
          Aucun sous-traitant trouvé. La liste est vide.
        </Alert>
      </Box>
    );
  }

  return (
    // CONTENEUR PRINCIPAL (Flexbox)
    <Box
      sx={{
        display: "flex",
        height: `${height}px`,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Colonne de gauche : La Liste des Sous-traitants */}
      <Box
        sx={{
          height: "100%",
          padding: 2,
          backgroundColor: "background.paper",
          overflowY: "auto",
          width: listWidth,
          transition: "width 0.3s ease-in-out",
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom align="center">
          Liste des Sous-traitants ({subunternehmerList.length} au total)
        </Typography>

        <List disablePadding>
          {subunternehmerList.map((subunternehmer, index) => (
            <ListItem
              // Utilisation de l'index comme clé de secours si l'ID n'est pas présent
              key={subunternehmer.id ?? index}
              disablePadding
              sx={{ mb: 1.5 }}
            >
              <Card
                onClick={() => handleCardClick(subunternehmer)}
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  // Utilisation de l'Id réel pour le style de sélection
                  borderColor:
                    selectedSubunternehmer?.id === subunternehmer.id
                      ? "primary.main"
                      : "transparent",
                  borderWidth: 2,
                  borderStyle: "solid",
                  boxShadow:
                    selectedSubunternehmer?.id === subunternehmer.id
                      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                      : "0 2px 4px rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    boxShadow:
                      selectedSubunternehmer?.id === subunternehmer.id
                        ? "0 6px 16px rgba(0, 0, 0, 0.2)"
                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent>
                  {/* Utilisation des champs en PascalCase du modèle réel */}
                  <Typography variant="h6" component="div" noWrap>
                    {subunternehmer.firmenname} (
                    {subunternehmer.ansprechpartnername})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spécialité : <strong>{subunternehmer.fachgebiet}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Colonne de droite : Les Détails du Sous-traitant Sélectionné */}
      {selectedSubunternehmer && (
        <Box
          sx={{
            height: "100%",
            padding: 3,
            backgroundColor: "background.default",
            overflowY: "auto",
            borderLeft: 1,
            borderColor: "grey.300",
            width: "50%",
            flexGrow: 1,
          }}
        >
          <Typography variant="h5" gutterBottom color="primary">
            Détails de l'entreprise {selectedSubunternehmer.firmenname}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Section Informations Générales */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Informations de Contact
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Contact :</strong>{" "}
            {selectedSubunternehmer.ansprechpartnername}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Téléphone :</strong> {selectedSubunternehmer.telefonnummer}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email :</strong> {selectedSubunternehmer.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Adresse :</strong> {selectedSubunternehmer.adresse}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Section Caractéristiques de l'Entreprise */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Caractéristiques de l'Entreprise
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Forme Juridique :</strong>{" "}
            {selectedSubunternehmer.rechtsformDesUnternehmens}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>ID TVA (USt-IdNr) :</strong>{" "}
            {selectedSubunternehmer.umsatznsteuerIdentifikationsnummer}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Catégorie :</strong> {selectedSubunternehmer.fachgebiet}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Régions de travail :</strong>{" "}
            {selectedSubunternehmer.arbeitsregionen}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Employés :</strong>{" "}
            {selectedSubunternehmer.anzahlDerMitarbeiter}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Section Qualifications */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Qualifications & Logistique
          </Typography>
          <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
            <Typography
              variant="subtitle2"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Qualifications :
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {selectedSubunternehmer.qualifikationen || "Non spécifié."}
            </Typography>

            <Typography
              variant="subtitle2"
              component="div"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Expérience :
            </Typography>
            <Typography variant="body2">
              {selectedSubunternehmer.erfarung || "Non spécifié."}
            </Typography>

            <Typography
              variant="subtitle2"
              component="div"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Disponibilité (date) :
            </Typography>
            <Typography variant="body2">
              {selectedSubunternehmer.verfügbarkeitdatum || "Non spécifié."}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Section Informations Financières et Diverses */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Informations Financières & Diverses
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Assurance :</strong>{" "}
            {selectedSubunternehmer.versicherungsschutz || "Non spécifié."}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Banque :</strong>{" "}
            {selectedSubunternehmer.bankverbindung || "Non spécifié."}
          </Typography>
          <Box
            sx={{ mt: 2, p: 2, border: "1px dashed grey.400", borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Autres remarques (Sonstige) :
            </Typography>
            <Typography variant="body2">
              {selectedSubunternehmer.sonstige || "Aucune remarque fournie."}
            </Typography>
          </Box>
          <Box
            sx={{ mt: 2, p: 2, border: "1px dashed grey.400", borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Jour de creation :
            </Typography>
            <Typography variant="body2">
              {selectedSubunternehmer.erstellungsZeit
                ? formatDate(selectedSubunternehmer.erstellungsZeit)
                : "Aucune remarque fournie."}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
