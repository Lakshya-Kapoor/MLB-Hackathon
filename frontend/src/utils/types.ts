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
  team_name: string;
  team_logo: string;
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

export interface HittingStats {
  homeRuns: number;
  strikeOuts: number;
  baseOnBalls: number;
  hits: number;
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  stolenBases: number;
  rbi: number;
}

export interface PitchingStats {
  homeRuns: number;
  strikeOuts: number;
  era: string;
  inningsPitched: string;
  wins: number;
  losses: number;
  saves: number;
  blownSaves: number;
  whip: string;
  winPercentage: string;
}

export interface FieldingStats {
  assists: number;
  putOuts: number;
  errors: number;
  rangeFactorPer9Inn: string;
  doublePlays: number;
}

export interface ArticleData {
  _id: string;
  title: string;
  catchyPhrase: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  url: string;
  publishedDate: Date;
  uploadDate: Date;
  reactions: {
    upVotes: number;
    downVotes: number;
  };
}

export interface Game {
  gamePk: number;
  gameType: string;
  gameDate: string;
  statusCode: string;
  statusDetails: string;
  homeTeam: string;
  homeTeamId: number;
  awayTeam: string;
  awayTeamId: number;
  gameTypeDetails: string;
  awayTeamScore?: number;
  homeTeamScore?: number;
  tied?: boolean;
  winner?: "home" | "away";
}

export interface StandingsData {
  divisionRank: string;
  leagueRank: string;
  gamesPlayed: number;
  runsAllowed: number;
  runsScored: number;
  clinched: boolean;
  wins: number;
  losses: number;
  runDifferential: number;
  teamId: number;
  teamName: string;
  streakCode: string;
}

export interface RankingsType {
  AL: StandingsData[];
  AL_East: StandingsData[];
  AL_West: StandingsData[];
  AL_Central: StandingsData[];
  NL: StandingsData[];
  NL_East: StandingsData[];
  NL_West: StandingsData[];
  NL_Central: StandingsData[];
}
