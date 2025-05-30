export interface Trainer {
  first_name: string;
  last_name: string;
  bio: string;
  years_experience: number;
}

export interface Athlete {
  athlete_user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age: number;
  level: number;
  trainer?: Trainer;
}

export interface Drill {
  drill_type: string;
  level: number;
  description: string;
}

export interface SessionDrill {
  drill: Drill;
}

export interface Session {
  session_name: string;
  length: number;
  level: string;
  Session_Drill: SessionDrill[];
}

export interface AthleteSessionItem {
  session_id: number;
  athlete_user_id: number;
  session: Session;
}
