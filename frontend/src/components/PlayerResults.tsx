import { useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";

export default function PlayerResults({ players }: { players: any }) {
  return (
    <div className="flex flex-col gap-2 select-none">
      <h3 className="text-light5 mb-2 text-2xl font-semibold">Players</h3>
      {players.map((player: any) => (
        <PlayerSearchResult player={player} key={player.player_id} />
      ))}
    </div>
  );
}

function PlayerSearchResult({ player }: { player: any }) {
  const { search, setSearch } = useContext(SearchContext);
  const url = `/players/${player.player_id}`;

  return (
    <Link
      to={url}
      onClick={() => setSearch(!search)}
      className="flex gap-4 items-center hover:bg-dark1 hover:bg-opacity-50 hover:cursor-pointer py-2 px-3"
    >
      {/* <div className="bg-gray-500 p-2 rounded-full"> */}
      <img src={player.image} alt={player.name} className="w-6" />
      {/* </div> */}
      <p className="text-light1 text-lg">{player.name}</p>
    </Link>
  );
}
