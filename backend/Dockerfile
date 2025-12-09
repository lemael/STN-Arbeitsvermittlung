# Étape 1: Build - Utilisation de l'image SDK pour compiler
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet (.csproj) et restaurer les dépendances
COPY backend.csproj .
RUN dotnet restore backend.csproj

# Copier tout le code source et compiler
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Étape 2: Final - Utilisation de l'image Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copier l'application publiée
COPY --from=build /app/publish .

EXPOSE 8080

# Assurez-vous que le nom de la DLL est correct (ici: backend.dll)
ENTRYPOINT ["dotnet", "backend.dll"]