export interface GameItem {
  id: number;
  title: string;
  genre: string;
}

const API_BASE_URL = '/api';

export async function fetchGames() {
  const response = await fetch(`${API_BASE_URL}/games`);

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }

  return response.json();
}
