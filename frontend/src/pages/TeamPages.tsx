import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerData } from "../utils/types";

export function TeamHome() {
  return <div className="text-white">Home</div>;
}

export function TeamRoster() {
  const { id } = useParams();
  const [roster, setRoster] = useState<PlayerData[] | null>(null);

  useEffect(() => {
    const url = `http://localhost:8000/teams/${id}/roster`;

    let ignore = false;

    async function getRoster() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        setRoster(data);
      }
    }

    getRoster();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (!roster) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <table className="table-auto w-full select-none">
      <thead className="text-light2">
        <tr className="h-10">
          <th className="text-left"></th>
          <th className="text-left">NAME</th>
          <th className="text-left">POS</th>
          <th className="text-left">BAT</th>
          <th className="text-left">PITCH</th>
          <th className="text-left">AGE</th>
          <th className="text-left">HT</th>
          <th className="text-left">WT</th>
          <th className="text-left">Birth Place</th>
        </tr>
      </thead>
      <tbody className="text-light3">
        {roster.map((player, index) => (
          <PlayerInfo key={player.player_id} player={player} index={index} />
        ))}
      </tbody>
    </table>
  );
}

function PlayerInfo({ player, index }: { player: PlayerData; index: number }) {
  return (
    <tr className={`h-12 ${index % 2 === 0 ? "bg-light5 bg-opacity-10" : ""}`}>
      <td className="text-left">
        <img src={player.image} className="w-6 rounded-full" />
      </td>
      <td>{player.name}</td>
      <td>{player.primary_position}</td>
      <td>{player.bat_side.slice(0, 1)}</td>
      <td>{player.pitch_hand.slice(0, 1)}</td>
      <td>{player.age}</td>
      <td>{player.height}</td>
      <td>{player.weight}</td>
      <td>{player.birth_place}</td>
    </tr>
  );
}

export function TeamStats() {
  return <div className="text-white">Stats</div>;
}

export function TeamSchedule() {
  return <div className="text-white">Schedule</div>;
}

export function TeamArticles() {
  return <div className="text-white">Articles</div>;
}

export function TeamPolls() {
  return <div className="text-white">Polls</div>;
}
