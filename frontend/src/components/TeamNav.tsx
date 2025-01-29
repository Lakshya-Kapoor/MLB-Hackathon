import { TeamSection } from "../utils/types";
import {
  Home,
  PersonStanding,
  BarChart,
  Calendar,
  FileText,
  CopyCheck,
} from "lucide-react";

export default function TeamNav({
  section,
  setSection,
}: {
  section: TeamSection;
  setSection: React.Dispatch<React.SetStateAction<TeamSection>>;
}) {
  return (
    <div className="border-b border-dark1 select-none relative">
      <nav className="-mb-px flex space-x-8">
        <TeamNavButton section={section} setSection={setSection} name="Home" />
        <TeamNavButton
          section={section}
          setSection={setSection}
          name="Roster"
        />
        <TeamNavButton section={section} setSection={setSection} name="Stats" />
        <TeamNavButton
          section={section}
          setSection={setSection}
          name="Schedule"
        />
        <TeamNavButton
          section={section}
          setSection={setSection}
          name="Articles"
        />
        <TeamNavButton section={section} setSection={setSection} name="Polls" />
      </nav>
    </div>
  );
}

function TeamNavButton({
  section,
  name,
  setSection,
}: {
  section: TeamSection;
  name: TeamSection;
  setSection: React.Dispatch<React.SetStateAction<TeamSection>>;
}) {
  const icons = {
    Home: <Home className="h-5 w-5 mr-2" />,
    Roster: <PersonStanding className="h-5 w-5 mr-2" />,
    Stats: <BarChart className="h-5 w-5 mr-2" />,
    Schedule: <Calendar className="h-5 w-5 mr-2" />,
    Articles: <FileText className="h-5 w-5 mr-2" />,
    Polls: <CopyCheck className="h-5 w-5 mr-2" />,
  };

  return (
    <button
      className={`
          relative pb-4 px-1 font-medium text-lg flex items-center
          transition-all duration-300 ease-in-out ${
            section === name
              ? "text-blue-600/100 hover:text-opacity-60"
              : "text-light5 text-opacity-60 hover:text-opacity-100"
          }
        `}
      onClick={() => setSection(name as TeamSection)}
    >
      <span
        className={`
          flex items-center
          transform transition-transform duration-300 ease-in-out
          ${section === name ? "scale-105" : ""}
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
            section === name
              ? "bg-blue-600 scale-x-100"
              : "bg-transparent scale-x-0 hover:scale-x-100 hover:bg-gray-300"
          }
        `}
      />
    </button>
  );
}
