import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

// --- Types basés sur la demande de l'utilisateur ---
type Betreff = "Neubau" | "Renovierung" | "Reparatur" | "Wartung";
type ProjektArt = "Wohnhaus" | "Gewerbebau" | "Infrastruktur";
type Status = "Prüfphase" | "Angebotserstellung" | "Vergeben" | "Abgeschlossen";

interface KundeFormData {
  id: string; // Ajouté pour l'utilisation dans le Kanban
  name: string;
  email: string;
  telefonnummer: string;
  betreff: Betreff;
  projektArt: ProjektArt;
  baubeginn: string;
  erstellungsZeit?: string;
  projektBeschreibung: string;
  status?: Status;
}

// --- Mock du Contexte de Données Client (similaire à SubunternehmerProvider) ---
const mockKundeList: KundeFormData[] = [
  {
    id: "k1",
    name: "Meier Bau GmbH",
    email: "m@b.de",
    telefonnummer: "12345",
    betreff: "Neubau",
    projektArt: "Wohnhaus",
    baubeginn: "2025-01-01",
    projektBeschreibung: "Description 1",
  },
  {
    id: "k2",
    name: "Schulz & Söhne",
    email: "s@s.de",
    telefonnummer: "67890",
    betreff: "Renovierung",
    projektArt: "Gewerbebau",
    baubeginn: "2025-03-15",
    projektBeschreibung: "Description 2",
  },
  {
    id: "k3",
    name: "Architekturbüro K.",
    email: "a@k.de",
    telefonnummer: "11223",
    betreff: "Wartung",
    projektArt: "Infrastruktur",
    baubeginn: "2024-12-01",
    projektBeschreibung: "Description 3",
  },
];

/**
 * MOCK de useKundeContext pour simuler la récupération de la liste des clients.
 */
const useKundeContext = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Simuler le chargement des données
  const loadKundeFromApi = useCallback(() => {
    setIsLoading(true);
    // Simuler un délai de réseau
    setTimeout(() => {
      setIsLoading(false);
      // setApiError("Erreur de connexion simulée.") // Décommenter pour tester l'erreur
    }, 800);
  }, []);

  // Retourne le mock de la liste et l'état de chargement
  return {
    kundeList: isLoading ? [] : mockKundeList,
    loadKundeFromApi,
    apiError,
  };
};

// --- Types pour le Kanban ---
type ColumnId = "Debut" | "InBearbeitung" | "Fin";

interface KanbanItem {
  id: string; // L'ID du client (KundeFormData.id)
  name: string; // Le nom affiché (KundeFormData.name)
  projektArt: ProjektArt; // Le type de projet pour l'affichage
}

type KanbanState = Record<ColumnId, KanbanItem[]>;

// Définition des colonnes du Kanban
const COLUMNS: {
  id: ColumnId;
  title: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "Debut",
    title: "Début (Start)",
    icon: <PlayCircleIcon />,
    color: "#1976d2",
  }, // Bleu
  {
    id: "InBearbeitung",
    title: "En cours (In Bearbeitung)",
    icon: <AccessTimeIcon />,
    color: "#ff9800",
  }, // Orange
  {
    id: "Fin",
    title: "Terminé (Fin)",
    icon: <CheckCircleIcon />,
    color: "#4caf50",
  }, // Vert
];

export function LaufendeProjekt({ height }: { height: number }) {
  // Contexte pour récupérer la liste des clients
  const { kundeList, loadKundeFromApi, apiError } = useKundeContext();

  // État du tableau Kanban
  const [kanbanState, setKanbanState] = useState<KanbanState>({
    Debut: [],
    InBearbeitung: [],
    Fin: [],
  });

  // État pour la sélection du client à ajouter
  const [selectedKundeId, setSelectedKundeId] = useState<string>("");

  // Flag pour savoir si l'état initial a été chargé
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // 1. Chargement initial de la liste des clients (via le hook mocké)
  useEffect(() => {
    if (kundeList.length === 0 && !apiError) {
      loadKundeFromApi();
    }
  }, [loadKundeFromApi, kundeList.length, apiError]);

  // 2. Initialisation du Kanban avec la liste des clients
  useEffect(() => {
    // Vérifie si la liste mockée a été chargée (elle a une longueur > 0)
    if (kundeList.length > 0 && !initialLoadComplete) {
      // Créer les items Kanban et les placer tous dans la colonne 'Debut'
      const initialItems: KanbanItem[] = kundeList.map((k) => ({
        id: k.id,
        name: k.name,
        projektArt: k.projektArt,
      }));

      setKanbanState({
        Debut: initialItems,
        InBearbeitung: [],
        Fin: [],
      });
      setInitialLoadComplete(true);
    }
  }, [kundeList, initialLoadComplete]);

  // 3. Gestion de l'ajout d'un élément sélectionné (via la liste déroulante)
  const handleAddKundeToBoard = (event: { target: { value: unknown } }) => {
    const kundeId = event.target.value as string;
    setSelectedKundeId(kundeId);

    if (kundeId) {
      const itemToAdd = kundeList.find((k) => k.id === kundeId);
      if (itemToAdd) {
        // Vérifier si l'élément n'est pas déjà sur le tableau
        const alreadyOnBoard = Object.values(kanbanState)
          .flat()
          .some((item) => item.id === kundeId);

        if (!alreadyOnBoard) {
          const newItem: KanbanItem = {
            id: itemToAdd.id,
            name: itemToAdd.name,
            projektArt: itemToAdd.projektArt,
          };

          setKanbanState((prevState) => ({
            ...prevState,
            // Ajout par défaut dans la colonne 'Debut'
            Debut: [newItem, ...prevState.Debut],
          }));
        }
      }
      // Réinitialiser la sélection après l'ajout (ou l'essai d'ajout)
      setSelectedKundeId("");
    }
  };

  // --- Logique Drag and Drop (Native HTML5) ---

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    itemId: string,
    currentColumnId: ColumnId
  ) => {
    e.dataTransfer.setData("itemId", itemId);
    e.dataTransfer.setData("originColumnId", currentColumnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumnId: ColumnId
  ) => {
    e.preventDefault();

    const itemId = e.dataTransfer.getData("itemId");
    const originColumnId = e.dataTransfer.getData("originColumnId") as ColumnId;

    if (!itemId || !originColumnId || originColumnId === targetColumnId) {
      return;
    }

    setKanbanState((prevState) => {
      // 1. Trouver l'item dans la colonne d'origine
      const itemToMove = prevState[originColumnId].find(
        (item) => item.id === itemId
      );

      if (!itemToMove) {
        return prevState;
      }

      // 2. Retirer l'item de la colonne d'origine
      const newOriginColumn = prevState[originColumnId].filter(
        (item) => item.id !== itemId
      );

      // 3. Ajouter l'item à la colonne cible
      const newTargetColumn = [...prevState[targetColumnId], itemToMove];

      return {
        ...prevState,
        [originColumnId]: newOriginColumn,
        [targetColumnId]: newTargetColumn,
      };
    });
  };

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
          <Typography variant="h6">
            Erreur de chargement des données clients
          </Typography>
          {apiError}
        </Alert>
      </Box>
    );
  }

  if (kundeList.length === 0 && !initialLoadComplete) {
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
          Chargement des données clients...
        </Typography>
      </Box>
    );
  }

  // Liste des IDs déjà sur le tableau
  const itemsOnBoard = Object.values(kanbanState)
    .flat()
    .map((item) => item.id);
  // Liste des clients qui ne sont PAS encore sur le tableau
  const availableKunde = kundeList.filter((k) => !itemsOnBoard.includes(k.id));

  return (
    <Box
      sx={{
        p: 3,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Projets en Cours (Laufende Projekt)
      </Typography>

      {/* 1. Liste Déroulante pour l'ajout de Nouveaux Projets/Clients */}

      {/* 2. Tableau Kanban (Todo Liste) - Flexbox pour les colonnes */}
      <Box
        sx={{
          display: "flex",
          // *** CLÉ 1: Empêche l'enveloppement des colonnes et force le défilement ***
          flexWrap: "nowrap",
          gap: 3,
          flexGrow: 1,
          // *** CLÉ 2: Active le défilement horizontal ***
          overflowX: "auto",
          // S'assure qu'il n'y a pas de hauteur minimale empêchant le scroll vertical
          minHeight: 0,
          pb: 2, // Ajoute un peu de padding en bas pour la barre de défilement
        }}
      >
        {COLUMNS.map((column) => (
          <Box
            key={column.id}
            sx={{
              // *** CLÉ 3: Définit une largeur minimale pour chaque colonne ***
              minWidth: "320px",
              // Rendement flexible pour l'espace restant, mais limité par minWidth
              flexShrink: 0,
              flexGrow: 1,
              // Définit une largeur maximale pour éviter une colonne trop large sur de grands écrans
              maxWidth: { xs: "none", md: "calc(33.333% - 16px)" },
            }}
          >
            {/* Colonne Droppable */}
            <Box
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "grey.50",
                boxShadow: 3,
                height: "100%", // La colonne prend toute la hauteur disponible du conteneur parent (Box ci-dessus)
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${column.color}`,
                }}
              >
                {React.cloneElement(
                  column.icon as React.ReactElement,
                  {
                    sx: { color: column.color, mr: 1 },
                  } as any
                )}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: column.color }}
                >
                  {column.title} ({kanbanState[column.id].length})
                </Typography>
              </Box>

              {/* Conteneur des cartes défilable verticalement */}
              <Box
                sx={{
                  overflowY: "auto", // Active le défilement vertical DANS la colonne
                  flexGrow: 1,
                  // Laisse les styles de la barre de défilement par défaut pour le défilement vertical
                  // J'ai retiré les styles pour masquer la scrollbar afin qu'elle soit visible
                }}
              >
                {kanbanState[column.id].length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2, p: 2 }}
                  >
                    Glissez-déposez hier (Zone de Dépôt)
                  </Typography>
                ) : (
                  kanbanState[column.id].map((item) => (
                    <Card
                      key={item.id}
                      draggable="true"
                      onDragStart={(e) =>
                        handleDragStart(e, item.id, column.id)
                      }
                      sx={{
                        mb: 2,
                        cursor: "grab",
                        boxShadow: 1,
                        borderLeft: `5px solid ${column.color}`,
                        "&:active": { cursor: "grabbing" },
                      }}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{ fontWeight: "medium" }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type de Projet: {item.projektArt}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
