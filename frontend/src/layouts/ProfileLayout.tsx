import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import { PlayerData, TeamData } from "../utils/types";
import { ProfileContext } from "../contexts/ProfileContext";
import ProfileNav from "../components/ProfileNav";

export default function ProfileLayout({ type }: { type: "players" | "teams" }) {
  const { id } = useParams();
  const [data, setData] = useState<TeamData | PlayerData | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const url = `http://localhost:8000/${type}?id=${id}`;

    let ignore = false;

    async function getTeamData() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        if (type === "players") {
          setData(data[0]);
        }
        setData(data[0]);
      }
    }
    getTeamData();

    return () => {
      ignore = true;
      setData(null);
    };
  }, [id, type]);

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <ProfileContext.Provider value={{ type, data }}>
      <div className="flex flex-col gap-11">
        <section className="flex justify-between items-center xl:mb-8">
          <div className="flex items-center gap-10">
            {"image" in data ? (
              <img src={data.image} className="xl:w-28 w-20 h-auto" />
            ) : (
              <div className="bg-light3 p-4 rounded-full ">
                <img src={data.logo} className="xl:w-28 xl:h-28 w-20 h-20" />
              </div>
            )}
            <div className="relative self-stretch flex flex-col justify-center">
              <h3 className="text-light1 xl:text-7xl text-6xl font-anton tracking-wider">
                {data.name.toUpperCase()}
              </h3>
              {type == "players" && (
                <Link
                  to={`/teams/${data.team_id}`}
                  className="flex items-center gap-2 absolute bottom-0"
                >
                  <p className="text-light5 font-medium text-lg">
                    {data.team_name}
                  </p>
                  <div className="bg-light5 p-1 rounded-full">
                    <img src={data.team_logo} className="w-5 h-5" />
                  </div>
                </Link>
              )}
            </div>
          </div>
          <FollowButton
            following={following}
            onClick={() => setFollowing(!following)}
          />
        </section>
        <div className="border-b border-dark1 select-none relative">
          <ProfileNav />
        </div>
        <Outlet />
      </div>
    </ProfileContext.Provider>
  );
}
