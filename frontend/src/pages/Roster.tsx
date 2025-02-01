import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlayerData } from "../utils/types";

export function Roster() {
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
    <table className="table-auto w-full">
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
          <tr
            key={player.player_id}
            className={`h-12 ${
              index % 2 === 0 ? "bg-light5 bg-opacity-10" : ""
            } `}
          >
            <td className="text-left">
              <img src={player.image} className="w-6 rounded-full" />
            </td>
            <td>
              <Link
                to={`/players/${player.player_id}`}
                className="text-lg text-blue-400 mr-2"
              >
                {player.name}
              </Link>
              <span className="text-sm text-light5">
                {player.primary_number}
              </span>
            </td>
            <td>{player.primary_position}</td>
            <td>{player.bat_side.slice(0, 1)}</td>
            <td>{player.pitch_hand.slice(0, 1)}</td>
            <td>{player.age}</td>
            <td>{player.height}</td>
            <td>{player.weight}</td>
            <td>{player.birth_place}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
