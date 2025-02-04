import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import {
  Calendar,
  Gauge,
  Hash,
  MapPin,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import {
  FieldingStats,
  Game,
  HittingStats,
  PitchingStats,
  PlayerData,
  TeamData,
} from "../utils/types";
import { Link, useParams } from "react-router-dom";

export default function ProfileHome() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState<{
    stats: {
      hitting: HittingStats;
      pitching: PitchingStats;
      fielding: FieldingStats;
    };
    games: Game[];
  } | null>(null);

  const { type, data } = useContext(ProfileContext)!;

  useEffect(() => {
    const urls = [
      `http://localhost:8000/${type}/${id}/stats`,
      `http://localhost:8000/schedule?teamId=${data?.team_id}&gameState=future`,
    ];

    let ignore = false;

    async function getProfileData() {
      const requests = urls.map(async (url) =>
        fetch(url).then((res) => res.json())
      );
      const responses = await Promise.all(requests);

      if (!ignore) {
        setProfileData({
          stats: responses[0],
          games: responses[1].slice(0, 5),
        });
      }
    }

    console.log(data?.team_id);
    getProfileData();

    return () => {
      ignore = true;
    };
  }, [id, type, data]);

  if (!profileData) {
    return <div className="text-white">Loading...</div>;
  } else if ("age" in data!) {
    return (
      <div className="bg-dark1/35 rounded-xl shadow-lg p-8 space-y-6">
        <PersonalInfo player={data} />
        <hr className="border-light1/30" />
        <Stats player={data} stats={profileData.stats} />
        <hr className="border-light1/30" />
        <Schedule games={profileData.games} />
      </div>
    );
  } else {
    return (
      <div className="bg-dark1/35 rounded-xl shadow-lg p-8 space-y-6">
        <TeamInfo team={data!} />
        <hr className="border-light1/30" />
        <Stats stats={profileData.stats} />
        <hr className="border-light1/30" />
        <Schedule games={profileData.games} />
      </div>
    );
  }
}

function Schedule({ games }: { games: Game[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-light1">Upcoming Matches</h2>
      <div className="overflow-hidden rounded-lg border border-dark1">
        <table className="min-w-full table-auto">
          <thead className="bg-dark1">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-light5">
                HOME TEAM
              </th>
              <th className="p-3 text-left text-sm font-semibold text-light5">
                AWAY TEAM
              </th>
              <th className="p-3 text-left text-sm font-semibold text-light5">
                DATE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light5/35">
            {games.map((game) => (
              <tr
                key={game.gamePk}
                className="text-sm hover:bg-dark1/40 transition-colors duration-200"
              >
                <td className="px-3 py-4 text-light1 font-medium">
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
                </td>
                <td className="px-3 py-4 text-light1 font-medium">
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
                </td>
                <td className="px-3 py-4 text-sm text-light3">
                  {formatDate(game.gameDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PersonalInfo({ player }: { player: PlayerData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-light1">
        Personal Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-light3">Age</p>
          <p className="font-medium text-lg text-light1">{player.age} years</p>
        </div>
        <div>
          <p className="text-sm text-light3">Height</p>
          <p className="font-medium text-lg text-light1">{player.height}</p>
        </div>
        <div>
          <p className="text-sm text-light3">Weight</p>
          <p className="font-medium text-lg text-light1">{player.weight} lbs</p>
        </div>
        <div>
          <p className="text-sm text-light3">Birth Place</p>
          <p className="font-medium text-lg flex items-center gap-1 text-light1">
            <MapPin size={16} className="text-light4" />
            {player.birth_place}
          </p>
        </div>
      </div>
    </div>
  );
}
function TeamInfo({ team }: { team: TeamData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-light1">Team Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-light3">Location</p>
          <p className="font-medium text-lg text-light1 flex gap-1 items-center">
            <MapPin size={16} className="text-light4" /> {team.location}
          </p>
        </div>
        <div>
          <p className="text-sm text-light3">First Year of Play</p>
          <p className="font-medium text-lg text-light1 flex items-center gap-1">
            <Calendar size={16} className="text-light4" />
            {team.first_year_play}
          </p>
        </div>
        <div>
          <p className="text-sm text-light3">League</p>
          <p className="font-medium text-lg text-light1">{team.league}</p>
        </div>
        <div>
          <p className="text-sm text-light3">Division</p>
          <p className="font-medium text-lg text-light1">{team.division}</p>
        </div>
      </div>
    </div>
  );
}

function Stats({
  player,
  stats,
}: {
  player?: PlayerData;
  stats: {
    hitting: HittingStats;
    pitching: PitchingStats;
    fielding: FieldingStats;
  };
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-light1">
        {player ? "Player" : "Team"} Statistics
      </h2>
      {player && (
        <div className="flex gap-2 flex-wrap">
          <InfoBadge
            icon={<Hash size={18} className="text-amber-400" />}
            text={player.primary_number}
          />
          <InfoBadge
            icon={<Target size={18} className="text-amber-400" />}
            text={player.primary_position}
          />
        </div>
      )}

      <div className="flex gap-2">
        {/* Hitting Stats */}
        {stats.hitting && (
          <StatsCard
            title="Hitting"
            icon={<Trophy size={18} className="text-red1" />}
          >
            <StatItem label="AVG" value={stats.hitting.avg} />
            <StatItem label="OPS" value={stats.hitting.ops} />
            <StatItem label="HR" value={stats.hitting.homeRuns} />
            <StatItem label="RBI" value={stats.hitting.rbi} />
            <StatItem label="OBP" value={stats.hitting.obp} />
          </StatsCard>
        )}

        {/* Pitching Stats */}
        {stats.pitching && (
          <StatsCard
            title="Pitching"
            icon={<Gauge size={18} className="text-blue-500" />}
          >
            <StatItem label="ERA" value={stats.pitching.era} />
            <StatItem label="WHIP" value={stats.pitching.whip} />
            <StatItem
              label="SO"
              value={`${stats.pitching.wins}-${stats.pitching.strikeOuts}`}
            />
            <StatItem label="IP" value={stats.pitching.inningsPitched} />
            <StatItem label="WINS" value={stats.pitching.wins} />
          </StatsCard>
        )}

        {/* Fielding Stats */}
        {stats.fielding && (
          <StatsCard
            title="Fielding"
            icon={<Shield size={18} className="text-emerald-400" />}
          >
            <StatItem label="PO" value={stats.fielding.putOuts} />
            <StatItem label="A" value={stats.fielding.assists} />
            <StatItem label="E" value={stats.fielding.errors} />
            <StatItem label="DP" value={stats.fielding.doublePlays} />
          </StatsCard>
        )}
      </div>
    </div>
  );
}

function InfoBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | number;
}) {
  return (
    <div className="flex items-center gap-2 bg-dark2 px-4 py-2 rounded-lg transition-transform transform hover:-translate-y-1 duration-300 ease-in-out">
      {icon}
      <span className="font-medium text-light1">{text}</span>
    </div>
  );
}

function StatsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark2 p-4 rounded-lg transition-transform transform hover:-translate-y-2 duration-300 ease-in-out">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-light1">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-[80px]">
      <p className="text-sm text-light3">{label}</p>
      <p className="font-medium text-light1">{value}</p>
    </div>
  );
}
