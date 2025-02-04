import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { Clock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Game } from "../utils/types";

export default function ProfileSchedule() {
  const { data } = useContext(ProfileContext)!;
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    const url = `http://localhost:8000/schedule?season=2024&teamId=${data?.team_id}&gameState=past`;

    let ignore = false;

    async function getSchedule() {
      const response = await fetch(url);
      const game_res = await response.json();

      if (!ignore) {
        setGames(game_res);
      }
    }

    getSchedule();

    return () => {
      ignore = true;
    };
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!games) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.gamePk}
          className="bg-dark1/60 hover:bg-dark1 transition-colors duration-200 text-light1 p-4 rounded-lg"
        >
          <div className="flex justify-between">
            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <span className="text-xl flex items-center gap-2">
                  <Link
                    to={`/teams/${game.homeTeamId}`}
                    className="flex items-center gap-2"
                  >
                    <img
                      className="w-5 h-5"
                      src={`https://www.mlbstatic.com/team-logos/${game.homeTeamId}.svg`}
                    />
                    {game.homeTeam}
                  </Link>
                  ({game.homeTeamScore})
                </span>
                <span>vs</span>
                <span className="text-xl flex items-center gap-2">
                  <Link
                    to={`/teams/${game.awayTeamId}`}
                    className="flex items-center gap-2"
                  >
                    <img
                      className="w-5 h-5"
                      src={`https://www.mlbstatic.com/team-logos/${game.awayTeamId}.svg`}
                    />
                    {game.awayTeam}
                  </Link>
                  ({game.awayTeamScore})
                </span>
              </div>
              {game.winner === "home" ? (
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-400" />
                  <span className="font-medium">{game.homeTeam} wins</span>
                </div>
              ) : game.winner === "away" ? (
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-400" />
                  <span className="font-medium">{game.awayTeam} wins</span>
                </div>
              ) : (
                game.tied && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-medium">Tied</span>
                  </div>
                )
              )}
            </div>
            <div className="text-sm">{formatDate(game.gameDate)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
