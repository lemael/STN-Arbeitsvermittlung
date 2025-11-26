# Étape 1: SDK - pour compiler et publier l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet et restaurer les dépendances NuGet
COPY ["backend.Api.csproj", "."] # Adaptez le nom du fichier .csproj
RUN dotnet restore "backend.Api.csproj"

# Copier tout le code source et compiler
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Étape 2: Runtime - Utiliser une image plus légère pour l'exécution
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copier l'application publiée
COPY --from=build /app/publish .

# Définir le point d'entrée pour l'exécution
ENTRYPOINT ["dotnet", "backend.Api.dll"] # Adaptez le nom du .dll si nécessaire

# Expose le port par défaut de Kestrel
EXPOSE 8080