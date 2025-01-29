import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import TeamNav from "../components/TeamNav";
import { TeamData } from "../utils/types";

export default function TeamLayout() {
  const { id } = useParams();
  const [data, setData] = useState<TeamData | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const url = `http://localhost:8000/teams?id=${id}`;

    let ignore = false;

    async function getTeamData() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        setData(data[0]);
        console.log(data[0]);
      }
    }
    getTeamData();

    return () => {
      ignore = true;
      setData(null);
    };
  }, [id]);

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <section className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-10">
          <div className="bg-light3 p-4 rounded-full ">
            <img src={data.logo} className="xl:w-28 xl:h-28 w-20 h-20" />
          </div>
          <h3 className="text-light1 xl:text-6xl text-5xl font-anton tracking-wider">
            {data.name.toUpperCase()}
          </h3>
        </div>
        <FollowButton
          following={following}
          onClick={() => setFollowing(!following)}
        />
      </section>
      <div className="border-b border-dark1 select-none relative mb-12">
        <TeamNav />
      </div>
      <Outlet />
    </div>
  );
}
