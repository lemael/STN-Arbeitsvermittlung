import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import Subunternehmer from "../Models/Subunternehmer";
import API_BASE from "../constants/API_base";

// ------------------------------------------
// DÉFINITIONS DE TYPES POUR LE MODÈLE SUBUNTERNEHMER
// (Basé sur le formulaire précédent et le modèle C# attendu)
// ------------------------------------------

// Interface pour les données reçues de l'API, incluant un identifiant
export interface SubunternehmerWithId extends Subunternehmer {
  id: number; // L'identifiant unique du sous-traitant
  // Ajout d'une date de création pour le tri si disponible
  CreatedAt?: string;
}

// ------------------------------------------
// DÉFINITION DU CONTEXTE
// ------------------------------------------

interface SubunternehmerContextType {
  subunternehmerList: SubunternehmerWithId[];
  notificationCount: number;
  loadSubunternehmerFromApi: () => Promise<void>;
  markAllAsRead: () => void;
  apiError: string | null;
}

// Création du contexte
const SubunternehmerContext = createContext<
  SubunternehmerContextType | undefined
>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useSubunternehmerContext = () => {
  const context = useContext(SubunternehmerContext);
  if (!context) {
    throw new Error(
      "useSubunternehmerContext doit être utilisé dans un SubunternehmerProvider"
    );
  }
  return context;
};

// ------------------------------------------
// COMPOSANT PROVIDER
// ------------------------------------------

interface SubunternehmerProviderProps {
  children: ReactNode;
}

export const SubunternehmerProvider: React.FC<SubunternehmerProviderProps> = ({
  children,
}) => {
  const [subunternehmerList, setSubunternehmerList] = useState<
    SubunternehmerWithId[]
  >([]);
  // Simule le nombre de nouvelles notifications
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Remplacez par l'URL réelle de l'API pour lister les sous-traitants
  const API_URL = `${API_BASE}/api/subunternehmer/list`;

  const loadSubunternehmerFromApi = useCallback(async () => {
    setApiError(null);
    console.log(
      `Tentative de chargement des sous-traitants depuis: ${API_URL}`
    );

    try {
      const response = await fetch(API_URL);

      // Vérification du statut HTTP
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Erreur HTTP ${response.status}: ${response.statusText}`,
          errorText
        );
        setApiError(
          `Impossible de charger les données : Erreur HTTP ${response.status}.`
        );
        return;
      }

      // Tentative de désérialisation JSON
      const data: SubunternehmerWithId[] = await response.json();

      // Tri par Id décroissant (simulant le plus récent en premier)
      const sortedData = data.sort((a, b) => b.id - a.id);

      setSubunternehmerList(sortedData);
      // Met le nombre de notifications au nombre total d'éléments (à adapter pour le statut "lu/non lu")
      setNotificationCount(sortedData.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors du chargement des sous-traitants.";
      console.error(
        "Erreur réseau ou parsing JSON lors du chargement des sous-traitants:",
        message,
        error
      );
      setApiError(
        `Erreur réseau: ${message}. Vérifiez la console pour plus de détails.`
      );
    }
  }, [API_URL]);

  const markAllAsRead = useCallback(() => {
    // Logique pour marquer tous comme lus (peut impliquer un appel API)
    setNotificationCount(0);
    console.log("Tous les messages sous-traitants ont été marqués comme lus.");
  }, []);

  // Valeurs fournies par le contexte
  const contextValue = React.useMemo(
    () => ({
      subunternehmerList,
      notificationCount,
      loadSubunternehmerFromApi,
      markAllAsRead,
      apiError,
    }),
    [
      subunternehmerList,
      notificationCount,
      loadSubunternehmerFromApi,
      markAllAsRead,
      apiError,
    ]
  );

  return (
    <SubunternehmerContext.Provider value={contextValue}>
      {children}
    </SubunternehmerContext.Provider>
  );
};
