import { ChangeEvent, useState } from "react";
import SearchInput from "./SearchInput";
import TeamResults from "./TeamResults";
import PlayerResults from "./PlayerResults";

export default function Search() {
  const [text, setText] = useState("");
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [articles, setArticles] = useState([]);

  async function searchFunction(text: string) {
    const urls = [
      `http://localhost:8000/teams?name=${text}&limit=5`,
      `http://localhost:8000/players?name=${text}&limit=5`,
    ];

    const requests = urls.map(async (url) =>
      fetch(url).then((res) => res.json())
    );
    const responses = await Promise.all(requests);
    setTeams(responses[0]);
    setPlayers(responses[1]);
  }

  async function searchChange(e: ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setText(text);
    if (text === "") {
      setTeams([]);
      setPlayers([]);
      setArticles([]);
      return;
    }

    await searchFunction(text);
  }

  return (
    <div>
      <SearchInput value={text} onChange={async (e) => await searchChange(e)} />
      <div className="mt-12 grid grid-cols-2">
        {teams.length > 0 && <TeamResults teams={teams} />}
        {players.length > 0 && <PlayerResults players={players} />}
        {(teams.length > 0 || players.length > 0) && articles.length > 0 && (
          <span className="col-span-2 bg-dark1 h-[2px] my-5" />
        )}
        {articles.length > 0 && <ArticleResults />}
      </div>
    </div>
  );
}

function ArticleResults() {
  return (
    <div className="col-span-2">
      <h3 className="text-2xl text-light3 font-semibold">Articles</h3>
    </div>
  );
}
