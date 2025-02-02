import { Link, useLocation, useParams } from "react-router-dom";
import { TeamSection } from "../utils/types";
import {
  BarChart,
  Calendar,
  CopyCheck,
  FileText,
  Home,
  PersonStanding,
} from "lucide-react";

export default function SubNavButton({ name }: { name: TeamSection }) {
  const { id } = useParams();
  const location = useLocation();

  let url = `/teams/${id}`;

  if (location.pathname.includes("players")) {
    url = url.replace("teams", "players");
  }

  if (name !== "Home") {
    url += `/${name.toLowerCase()}`;
  }

  const isActive = location.pathname === url;

  const icons = {
    Home: <Home className="h-5 w-5 mr-2" />,
    Roster: <PersonStanding className="h-5 w-5 mr-2" />,
    Stats: <BarChart className="h-5 w-5 mr-2" />,
    Schedule: <Calendar className="h-5 w-5 mr-2" />,
    Articles: <FileText className="h-5 w-5 mr-2" />,
    Polls: <CopyCheck className="h-5 w-5 mr-2" />,
  };

  return (
    <Link
      to={url}
      className={`
          relative pb-4 px-1 font-medium text-lg flex items-center
          transition-all duration-300 ease-in-out ${
            isActive
              ? "text-blue-400"
              : "text-light5 text-opacity-60 hover:text-opacity-100"
          }
        `}
    >
      <span
        className={`
          flex items-center
          transform transition-transform duration-300 ease-in-out
          ${isActive ? "scale-105" : ""}
        `}
      >
        {icons[name as keyof typeof icons]}
        {name}
      </span>
      <div
        className={`
          absolute bottom-0 left-0 w-full h-[1px]
          transform transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bg-blue-400 scale-x-100"
              : "bg-transparent scale-x-0 hover:scale-x-100 hover:bg-gray-300"
          }
        `}
      />
    </Link>
  );
}
