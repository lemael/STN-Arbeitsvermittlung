using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class createSubunternehmerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Subunternehmer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Firmenname = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Ansprechpartnername = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Adresse = table.Column<string>(type: "text", nullable: false),
                    Telefonnummer = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Fachgebiet = table.Column<string>(type: "text", nullable: false),
                    Qualificationen = table.Column<string>(type: "text", nullable: false),
                    Erfarung = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Verfügbarkeitdatum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Arbeitsregionen = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    AnzahlDerMitarbeiter = table.Column<int>(type: "integer", nullable: false),
                    UmsatznsteuerIdentifikationsnummer = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RechtsformDesUnternehmens = table.Column<string>(type: "text", nullable: false),
                    Versicherungsschutz = table.Column<string>(type: "text", nullable: false),
                    Bankverbindung = table.Column<string>(type: "text", nullable: false),
                    Sonstige = table.Column<string>(type: "text", nullable: false),
                    ErstellungsZeit = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subunternehmer", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Subunternehmer");
        }
    }
}
