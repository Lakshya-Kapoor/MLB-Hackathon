export interface TeamData {
  team_id: number;
  name: string;
  logo: string;
  location: string;
  league: string;
  division: string;
  first_year_play: number;
}

export type TeamSection =
  | "Home"
  | "Roster"
  | "Stats"
  | "Schedule"
  | "Articles"
  | "Polls";
