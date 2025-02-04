import { useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";

export default function TeamResults({ teams }: { teams: any }) {
  return (
    <div className="flex flex-col gap-2 select-none">
      <h3 className="text-light5 mb-2 text-2xl font-semibold">Teams</h3>
      {teams.map((team: any) => (
        <TeamSearchResult team={team} key={team.team_id} />
      ))}
    </div>
  );
}

function TeamSearchResult({ team }: { team: any }) {
  const { search, setSearch } = useContext(SearchContext);
  const url = `/teams/${team.team_id}`;

  return (
    <Link
      to={url}
      onClick={() => setSearch(!search)}
      className="flex gap-4 items-center hover:bg-dark1 hover:bg-opacity-50 hover:cursor-pointer p-3"
    >
      {/* <div className="bg-light3 p-2 rounded-full"> */}
      <img src={team.logo} alt={team.name} className="h-7 w-7" />
      {/* </div> */}
      <p className="text-light1 font-semibold text-lg">{team.name}</p>
    </Link>
  );
}
