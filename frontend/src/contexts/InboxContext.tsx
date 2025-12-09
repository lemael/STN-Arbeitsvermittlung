import React, { createContext, ReactNode, useContext, useState } from "react";
import Kunde from "../Models/Kunde";
import API_BASE from "../constants/API_base";

// Définitions de types basées sur votre structure Kunde.cs et le tableau de la boîte de réception

export interface KundeWithId extends Kunde {
  id: number;
  // Ajout d'un champ pour la date de réception, crucial pour le tri et l'affichage
}

interface InboxContextType {
  newKunden: KundeWithId[];
  notificationCount: number;
  loadKundenFromApi: () => Promise<void>;
  markAllAsRead: () => void;
  apiError: string | null; // Pour afficher l'erreur réseau dans le composant
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const useInboxContext = () => {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error("useInboxContext doit être utilisé dans un InboxProvider");
  }
  return context;
};

interface InboxProviderProps {
  children: ReactNode;
}

export const InboxProvider: React.FC<InboxProviderProps> = ({ children }) => {
  const [newKunden, setNewKunden] = useState<KundeWithId[]>([]);
  // Nous stockons l'état des clients non lus dans le provider.
  // Initialement, on suppose que tous sont non lus si on vient de les charger.
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const API_URL = `${API_BASE}/api/kunde/list`; // L'URL correcte de votre API

  const loadKundenFromApi = async () => {
    setApiError(null); // Réinitialiser l'erreur
    console.log(`Tentative de chargement des clients depuis: ${API_URL}`);

    try {
      const response = await fetch(API_URL);

      // *** CORRECTION POUR ÉVITER LE SYNTAXERROR ***
      // Vérifiez d'abord si la réponse HTTP est OK (statut 200-299)
      if (!response.ok) {
        // Si ce n'est pas OK, tentez de lire le corps comme texte pour le débogage.
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

      // Si la réponse est OK, on peut maintenant tenter de la parser en JSON.
      // C'est ici que l'erreur se produisait à la ligne 93 si la réponse était HTML.
      const data: KundeWithId[] = await response.json();

      // Assurez-vous que les clients sont triés par ID/Date (simulé ici par l'ID décroissant)
      const sortedData = data.sort((a, b) => b.id - a.id);

      setNewKunden(sortedData);
      // Supposons que tous les clients chargés sont initialement non lus (ou non lus par défaut)
      setNotificationCount(sortedData.length);
    } catch (error) {
      // Cette capture gère les erreurs réseau (comme la coupure de connexion)
      // et le JSON.parse() qui échoue (le fameux SyntaxError).
      const message =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors du chargement des clients.";
      console.error(
        "Erreur réseau lors du chargement des clients:",
        message,
        error
      );
      setApiError(
        `Erreur réseau: ${message}. Vérifiez la console pour plus de détails.`
      );
    }
  };

  const markAllAsRead = () => {
    // Dans une application réelle, ceci appellerait une API pour marquer comme lu.
    setNotificationCount(0);
    console.log("Tous les messages ont été marqués comme lus.");
  };

  // Le contexte lui-même ne gère pas le chargement initial.
  // C'est le composant qui utilise useInboxContext qui appelle loadKundenFromApi.

  return (
    <InboxContext.Provider
      value={{
        newKunden,
        notificationCount,
        loadKundenFromApi,
        markAllAsRead,
        apiError,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};
