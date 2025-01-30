import { ChangeEvent, useState } from "react";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";

export default function Search() {
  const [text, setText] = useState("");
  const [teams, setTeams] = useState([]);

  async function searchFunction(text: string) {
    const response = await fetch(`http://localhost:8000/teams?name=${text}`);
    const data = await response.json();
    setTeams(data.slice(0, 5));
  }

  async function searchChange(e: ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setText(text);
    if (text === "") {
      setTeams([]);
      return;
    }

    await searchFunction(text);
  }

  return (
    <div className=" flex flex-col xl:w-[1200px] w-full pt-10">
      <SearchInput value={text} onChange={async (e) => await searchChange(e)} />
      {text !== "" && (
        <div className="mt-16 flex flex-col gap-2 select-none">
          <h3 className="text-light3 mb-3 text-3xl font-semibold">Teams</h3>
          {teams.map((team: any) => (
            <TeamSearchResult team={team} key={team.team_id} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamSearchResult({ team }: { team: any }) {
  const url = `/teams/${team.name}`;
  return (
    <Link
      to={url}
      className="flex gap-6 items-center hover:bg-dark1 hover:bg-opacity-50 hover:cursor-pointer py-2 px-3"
    >
      <div className="bg-light3 p-2 rounded-full">
        <img src={team.logo} alt={team.name} className="h-7" />
      </div>
      <p className="text-light5 text-lg font-medium">{team.name}</p>
    </Link>
  );
}
