import './App.css'
import {useEffect, useState} from "react";
import {fetchGames, type GameItem} from "./services/gameService.ts";

function App() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames()
        .then((data) => setGames(data))
        .catch((err) => setError(err.message));
  }, []);

  if(error) return <p>Error loading data: {error}</p>

  return (
    <div>
      <h1>My Game Library</h1>
      <ul>
        {games.map(game => (
            <li key={game.id}>{game.title} ({game.genre})</li>
        ))}
      </ul>
    </div>
  );
}

export default App
