using Microsoft.AspNetCore.Mvc;
using ProjectManagerAPI.Models;

namespace ProjectManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private static readonly List<GameItem> MockGames = new()
        {
            new GameItem {Id = 1, Title = "Survive if you can", Genre = "Bullet heaven"},
            new GameItem {Id = 2, Title = "Terraria", Genre = "Sandbox"},
            new GameItem {Id = 3, Title = "Chess Engine v1", Genre = "Strategy"},
            new GameItem {Id = 3, Title = "Chess Engine v1", Genre = "Strategy"},
            new GameItem {Id = 3, Title = "Chess Engine v1", Genre = "Strategy"},
        };

        [HttpGet]
        public ActionResult<IEnumerable<GameItem>> GetGames()
        {
            return Ok(MockGames);
        }

        [HttpGet("{id:int}")]
        public ActionResult<GameItem> GetGameById(int id)
        {
            var game = MockGames.FirstOrDefault(x => x.Id == id);

            if (game == null)
            {
                return NotFound(new { message = $"Game with ID {id} not found." });
            }
            return Ok(game);
        }
    }
}
