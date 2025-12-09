using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace Backend.Controllers
{
    // Configure le chemin de base pour ce contrôleur
    [Route("api/[controller]")]
    [ApiController]
    public class SubunternehmerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubunternehmerController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Récupère la liste de tous les clients (Kunden) de la base de données.
        /// GET: /api/kunde/list
        /// </summary>
        /// <returns>Une liste de tous les objets Kunde.</returns>
        [HttpGet("list")] // Ceci définit l'endpoint final comme /api/kunde/list
        public async Task<ActionResult<IEnumerable<Subunternehmer>>> GetSubunternehmerList()
        {
            // Récupère tous les clients de la table Kunden
            var subunternehmer = await _context.Subunternehmer.ToListAsync();
            
            // Retourne la liste avec le statut HTTP 200 OK
            return Ok(subunternehmer);
        }

        // Vous pouvez ajouter ici d'autres méthodes (POST, PUT, DELETE) si nécessaire.
    }
}