import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, BarChart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { RankingsType, StandingsData } from "../utils/types";

export default function Standings() {
  const [data, setData] = useState<RankingsType | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [selectedDivision, setSelectedDivision] = useState("AL");

  useEffect(() => {
    const url = `http://localhost:8000/standings?season=${selectedSeason}`;

    let ignore = false;

    async function getTeams() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        setData(data);
      }
    }
    getTeams();

    return () => {
      ignore = true;
    };
  }, [selectedSeason]);

  const StandingsData = (division: string) => {
    return {
      "AL East": data!.AL_East,
      "AL Central": data!.AL_Central,
      "AL West": data!.AL_West,
      "NL East": data!.NL_East,
      "NL Central": data!.NL_Central,
      "NL West": data!.NL_West,
      AL: data!.AL,
      NL: data!.NL,
    }[division];
  };

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="">
      {/* bg-gradient-to-tr from-dark1 via-dark4 to-dark1 */}
      <div className="mb-8 bg-dark1/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart className="h-8 w-8 text-yellow-400 " />
            Standings
          </h1>
          <SeasonSelector
            selectedSeason={selectedSeason}
            onSeasonChange={(season: string) => {
              setData(null);
              setSelectedSeason(season);
            }}
          />
        </div>
        <DivisionSelector
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
        />
      </div>

      <div className="animate-fadeIn">
        <StandingsTable
          title={selectedDivision}
          teams={StandingsData(selectedDivision)!}
        />
      </div>
    </div>
  );
}

function DivisionSelector({
  selectedDivision,
  onDivisionChange,
}: {
  selectedDivision: string;
  onDivisionChange: (division: string) => void;
}) {
  const divisions = [
    "AL",
    "AL West",
    "AL Central",
    "AL East",
    "NL",
    "NL West",
    "NL Central",
    "NL East",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {divisions.map((division) => (
        <button
          key={division}
          onClick={() => onDivisionChange(division)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedDivision === division
              ? "bg-light5/95 text-dark5"
              : "bg-dark5 text-light5"
          }`}
        >
          {division}
        </button>
      ))}
    </div>
  );
}

function StandingsTable({
  title,
  teams,
}: {
  title: string;
  teams: StandingsData[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-dark1">
      <div className="px-6 py-3 bg-dark1/70 border-b border-dark1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-light3 flex items-center gap-3">
            {title}
          </h2>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark5 text-white rounded-lg p-3 text-sm font-medium focus:outline-none"
          />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark1">
            <TableHeading>Rank</TableHeading>
            <TableHeading>Team</TableHeading>
            <TableHeading>W</TableHeading>
            <TableHeading>L</TableHeading>
            <TableHeading>PCT</TableHeading>
            <TableHeading>RS</TableHeading>
            <TableHeading>RA</TableHeading>
            <TableHeading>DIFF</TableHeading>
            <TableHeading>STRK</TableHeading>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark1">
          {filteredTeams.map((team) => (
            <TeamRow
              key={team.teamId}
              team={team}
              rankType={title.split(" ").length}
            />
          ))}
          {!filteredTeams.length && (
            <tr>
              <td colSpan={9} className="text-center py-4 text-light5">
                No teams found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-light5">
      {children}
    </td>
  );
}

function SeasonSelector({
  selectedSeason,
  onSeasonChange,
}: {
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
}) {
  const seasons = ["2024", "2023", "2022", "2021", "2020"];

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <select
        value={selectedSeason}
        onChange={(e) => onSeasonChange(e.target.value)}
        className="bg-dark5 text-white rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none transition-colors duration-200"
      >
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season} Season
          </option>
        ))}
      </select>
    </div>
  );
}

const TeamRow = ({
  team,
  rankType,
}: {
  team: StandingsData;
  rankType: number;
}) => {
  const calculateWinningPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? (wins / total).toFixed(3).substring(1) : ".000";
  };

  return (
    <tr className="hover:bg-dark1/30 transition-colors duration-150">
      <TableData>
        <span className={`text-2xl font-bold text-gray-500`}>
          {team[rankType === 1 ? "leagueRank" : "divisionRank"]}
        </span>
        {/* {team.clinched && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-700 text-blue-200">
              Clinched
            </span>
          )} */}
      </TableData>
      <TableData>
        <Link to={`/teams/${team.teamId}`} className="flex gap-2">
          <img
            src={`https://www.mlbstatic.com/team-logos/${team.teamId}.svg`}
            alt={team.teamName}
            className="w-5 h-5"
          />
          <span className="text-light1 text-md font-bold">{team.teamName}</span>
        </Link>
      </TableData>
      <TableData>{team.wins}</TableData>
      <TableData>{team.losses}</TableData>
      <TableData>
        {calculateWinningPercentage(team.wins, team.losses)}
      </TableData>
      <TableData>{team.runsScored}</TableData>
      <TableData>{team.runsAllowed}</TableData>
      <td className="px-6 py-5 whitespace-nowrap">
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            team.runDifferential > 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {team.runDifferential > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {team.runDifferential > 0 ? "+" : ""}
          {team.runDifferential}
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div
          className={`text-sm font-medium ${
            team.streakCode.startsWith("W")
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {team.streakCode}
        </div>
      </td>
    </tr>
  );
};
