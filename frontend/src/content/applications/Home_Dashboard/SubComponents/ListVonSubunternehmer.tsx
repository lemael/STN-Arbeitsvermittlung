import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
// Importez votre fichier JSON
import subunternehmerData from "./subunternehmer.json";

// Interface (Inclut toutes les clés de votre JSON)
interface Subunternehmer {
  // L'ID est maintenant obligatoire et doit être un nombre
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  description: string;
}

// ✅ FIX: Création d'un ID numérique unique basé sur l'index (index + 1)
const subunternehmerList: Subunternehmer[] = (subunternehmerData as any[]).map(
  (s: any, index: number) => ({
    ...s,
    // Nous créons un ID unique car il est manquant dans le JSON
    id: index + 1,
  })
);

export function ListVonSubunternehmer({ height }: { height: number }) {
  const [selectedSubunternehmer, setSelectedSubunternehmer] =
    useState<Subunternehmer | null>(null);

  const handleCardClick = (subunternehmer: Subunternehmer) => {
    // La comparaison est maintenant sûre (ID est un nombre)
    if (selectedSubunternehmer?.id === subunternehmer.id) {
      setSelectedSubunternehmer(null);
    } else {
      setSelectedSubunternehmer(subunternehmer);
    }
  };

  const listWidth = selectedSubunternehmer ? "50%" : "100%";

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
          Liste des Sous-traitants
        </Typography>

        <List disablePadding>
          {subunternehmerList.map((subunternehmer) => (
            <ListItem
              // Utilisation de l'ID généré pour la clé
              key={subunternehmer.id}
              disablePadding
              sx={{ mb: 1.5 }}
            >
              <Card
                onClick={() => handleCardClick(subunternehmer)}
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  borderColor:
                    selectedSubunternehmer?.id === subunternehmer.id
                      ? "primary.main"
                      : "transparent",
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {subunternehmer.name} ({subunternehmer.company})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spécialité :{/* ✅ Correction JSX */}
                    <strong>{subunternehmer.category}</strong>
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
            padding: 2,
            backgroundColor: "background.default",
            overflowY: "auto",
            borderLeft: 1, // Ajout d'une ligne de séparation
            borderColor: "grey.300",
            width: "50%",
            flexGrow: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Détails de {selectedSubunternehmer.name}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* ✅ Correction JSX pour le gras */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Entreprise :</strong> {selectedSubunternehmer.company}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Catégorie :</strong> {selectedSubunternehmer.category}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Adresse :</strong> {selectedSubunternehmer.address}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Téléphone :</strong> {selectedSubunternehmer.phone}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email :</strong> {selectedSubunternehmer.email}
          </Typography>

          <Box sx={{ mt: 3, p: 2, border: "1px dashed grey" }}>
            <Typography variant="subtitle1" gutterBottom>
              Description :
            </Typography>
            <Typography variant="body2">
              {selectedSubunternehmer.description}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
