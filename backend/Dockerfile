# Étape 1: SDK - pour compiler et publier l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copier le fichier projet et restaurer les dépendances NuGet
COPY backend.csproj .
RUN dotnet restore backend.csproj

# Copier tout le code source et compiler
COPY . .
RUN dotnet build backend.csproj -c Release
RUN dotnet publish backend.csproj -c Release -o /app/publish

# Étape 2: Runtime - Utiliser une image plus légère pour l'exécution
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS final
WORKDIR /app

# Copier l'application publiée
COPY --from=build /app/publish .

# Définir le point d'entrée pour l'exécution
ENTRYPOINT ["dotnet", "run",  "--urls=http://*:8080"]

# Expose le port par défaut de Kestrel
EXPOSE 8080