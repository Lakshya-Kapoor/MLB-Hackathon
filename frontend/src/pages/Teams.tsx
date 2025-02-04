import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface TeamData {
  divisionRank: string;
  leagueRank: string;
  gamesPlayed: number;
  runsAllowed: number;
  runsScored: number;
  clinched: boolean;
  wins: number;
  losses: number;
  runDifferential: number;
  teamId: number;
  teamName: string;
  streakCode: string;
}

interface RankingsType {
  AL_East: TeamData[];
  AL_West: TeamData[];
  AL_Central: TeamData[];
  NL_East: TeamData[];
  NL_West: TeamData[];
  NL_Central: TeamData[];
}

function FollowedTeams({
  names,
  data,
}: {
  names: string[];
  data: RankingsType;
}) {
  function findTeam(name: string): TeamData | undefined {
    for (const division in data) {
      for (const team of data[division as keyof RankingsType]) {
        if (team.teamName === name) {
          return team;
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-5 gap-5">
      {names.map((name) => {
        const team = findTeam(name);
        return team ? (
          <Link
            to={`/teams/${team.teamId}`}
            className="flex flex-col items-center gap-2 border border-dark1 hover:bg-dark1/40 rounded-lg p-4 transition-colors duration-200"
            key={team.teamId}
          >
            <img
              src={`https://www.mlbstatic.com/team-logos/${team.teamId}.svg`}
              className="w-20 h-20"
            />
            <span className="text-light5 font-medium">{team.teamName}</span>
          </Link>
        ) : null;
      })}
    </div>
  );
}

export default function Teams() {
  const [data, setData] = useState<RankingsType>();
  const [activeLeague, setActiveLeague] = useState<"AL" | "NL">("NL");
  const [following, setFollowing] = useState([]);
  const { userToken } = useContext(AuthContext)!;

  useEffect(() => {
    const urls = [
      `http://localhost:8000/standings?season=2024`,
      `http://localhost:8000/teams/follows`,
    ];

    let ignore = false;

    async function getTeams() {
      const requests = [
        fetch(urls[0]).then((res) => res.json()),
        fetch(urls[1], {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }).then((res) => res.json()),
      ];
      const responses = await Promise.all(requests);

      if (!ignore) {
        setData(responses[0]);
        setFollowing(responses[1]);
      }
    }
    getTeams();

    return () => {
      ignore = true;
    };
  }, [userToken]);

  type Division = [string, TeamData[]];

  function getLeagueDivisions(league: "AL" | "NL"): Division[] {
    return {
      AL: [
        ["AL_East", data!.AL_East],
        ["AL_Central", data!.AL_Central],
        ["AL_West", data!.AL_West],
      ] as Division[],
      NL: [
        ["NL_East", data!.NL_East],
        ["NL_Central", data!.NL_Central],
        ["NL_West", data!.NL_West],
      ] as Division[],
    }[league];
  }

  return (
    <div>
      {/* Pill-shaped tabs with gradient background */}
      <div className="bg-dark3 p-1 rounded-full inline-flex mx-auto mb-8">
        <LeagueButton
          league="NL"
          activeLeague={activeLeague}
          setActiveLeague={setActiveLeague}
        />
        <LeagueButton
          league="AL"
          activeLeague={activeLeague}
          setActiveLeague={setActiveLeague}
        />
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getLeagueDivisions(activeLeague).map(([division, teams]) => (
            <div
              key={division}
              className="flex flex-col rounded-xl border border-dark1"
            >
              <h2 className="text-xl font-bold text-light1 text-center bg-dark3 p-2 rounded-t-xl">
                {division.split("_")[1]}
              </h2>
              <div className="flex flex-col p-4 gap-3">
                {teams.map((team) => (
                  <div
                    key={team.teamId}
                    className="flex items-center gap-4 rounded-lg hover:bg-dark1/30 p-3 transition-colors duration-200"
                  >
                    <img
                      src={`https://www.mlbstatic.com/team-logos/${team.teamId}.svg`}
                      className="w-8 h-8 object-contain"
                    />
                    <Link
                      to={`/teams/${team.teamId}`}
                      className="text-light1 font-medium"
                    >
                      {team.teamName}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {following.length !== 0 && (
        <div className="mt-20 flex flex-col gap-4">
          <h3 className="text-light3 text-2xl font-semibold">Following</h3>
          <FollowedTeams names={following} data={data!} />
        </div>
      )}
    </div>
  );
}

interface LeagueButtonProps {
  league: "AL" | "NL";
  activeLeague: string;
  setActiveLeague: React.Dispatch<React.SetStateAction<"AL" | "NL">>;
}

function LeagueButton({
  league,
  activeLeague,
  setActiveLeague,
}: LeagueButtonProps) {
  return (
    <button
      onClick={() => setActiveLeague(league)}
      className={`px-4 py-2 rounded-full font-bold text-md transition-all duration-300 ${
        activeLeague === league
          ? "bg-gradient-to-r from-light5 to-light5/80 text-dark1 shadow-md"
          : "text-light4 hover:text-light1"
      }`}
    >
      {league === "AL" ? "American League" : "National League"}
    </button>
  );
}
