export interface TeamData {
  team_id: number;
  name: string;
  logo: string;
  location: string;
  league: string;
  division: string;
  first_year_play: number;
}

export interface PlayerData {
  name: string;
  player_id: number;
  team_id: number;
  age: number;
  height: string;
  weight: number;
  birth_place: string;
  primary_number: number;
  primary_position: string;
  bat_side: string;
  pitch_hand: string;
  image: string;
}

export type TeamSection =
  | "Home"
  | "Roster"
  | "Stats"
  | "Schedule"
  | "Articles"
  | "Polls";
