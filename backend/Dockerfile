# Étape 1: SDK - pour compiler et publier l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet et restaurer les dépendances NuGet
# Copie le fichier .csproj dans le répertoire de travail
COPY ["backend.csproj", "."] 
# Restaure les dépendances NuGet
RUN dotnet restore "backend.csproj"

# Copier tout le code source
COPY . .

# Construction de l'application (Ajouté pour la clarté et pour générer la DLL)
RUN dotnet build "backend.csproj" -c Release --no-restore

# Publier l'application (inclut le build si non fait, mais nous l'avons fait ci-dessus)
# La publication place les fichiers nécessaires dans le dossier /app/publish
RUN dotnet publish "backend.csproj" -c Release -o /app/publish --no-build

# Étape 2: Runtime - Utiliser une image plus légère pour l'exécution
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copier l'application publiée
COPY --from=build /app/publish .

# Définir le point d'entrée pour l'exécution
# Utilise la DLL générée par la publication
ENTRYPOINT ["dotnet", "backend.dll"] 
# Expose le port par défaut de Kestrel
EXPOSE 8080