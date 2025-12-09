# Étape 1: Build - Utilisation de l'image SDK pour compiler
# Cette étape est utilisée uniquement pour compiler l'application.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet (.csproj) et restaurer les dépendances
# Cela permet à Docker de mettre en cache la couche de restauration (la plus lente)
COPY backend.csproj .
RUN dotnet restore backend.csproj

# Copier tout le code source et compiler
COPY . .

# Publier l'application dans le dossier /app/publish
# Le flag /p:UseAppHost=false est souvent nécessaire pour les déploiements Linux
# afin d'éviter la création d'un binaire exécutable spécifique à l'hôte.
RUN dotnet publish backend.csproj -c Release -o /app/publish /p:UseAppHost=false

# Étape 2: Final - Utilisation de l'image Runtime (plus petite et sécurisée)
# Utiliser aspnet au lieu de sdk réduit la taille du conteneur final.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copier l'application publiée depuis l'étape 'build'
COPY --from=build /app/publish .

# Expose le port 8080 (le port par défaut du conteneur)
# Kestrel écoutera sur ce port grâce à la configuration dans Program.cs
EXPOSE 8080

# Définir le point d'entrée pour l'exécution : 
# Exécuter la DLL directement. C'est l'approche standard et rapide pour la production.
# IMPORTANT: Assurez-vous que le nom de la DLL correspond (généralement le nom du projet, ici: backend.dll)
ENTRYPOINT ["dotnet", "backend.dll"]