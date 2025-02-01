import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import { PlayerData, TeamData } from "../utils/types";
import { ProfileContext } from "../contexts/ProfileContext";
import ProfileNav from "../components/ProfileNav";

export default function ProfileLayout({
  profileType,
}: {
  profileType: "players" | "teams";
}) {
  const { id } = useParams();
  const [data, setData] = useState<TeamData | PlayerData | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const url = `http://localhost:8000/${profileType}?id=${id}`;

    let ignore = false;

    async function getTeamData() {
      const res = await fetch(url);
      const data = await res.json();

      if (!ignore) {
        if (profileType === "players") {
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
  }, [id, profileType]);

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <ProfileContext.Provider value={profileType}>
      <div className="flex flex-col gap-11">
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-10">
            {"image" in data ? (
              <img src={data.image} className="xl:w-28 xl:h-32 w-20 h-24" />
            ) : (
              <div className="bg-light3 p-4 rounded-full ">
                <img src={data.logo} className="xl:w-28 xl:h-28 w-20 h-20" />
              </div>
            )}
            <h3 className="text-light1 xl:text-6xl text-5xl font-anton tracking-wider">
              {data.name.toUpperCase()}
            </h3>
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
