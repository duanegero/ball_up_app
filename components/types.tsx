export interface Trainer {
  first_name: string;
  last_name: string;
  bio: string;
  years_experience: number;
  trainer_user_id: number;
  email: string;
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
  drill_id: number;
  drill_type: string;
  description: string;
  level: string;
  trainer_user_id: number;
}

export interface SessionDrill {
  drill: Drill;
}

export interface Session {
  session_id: number;
  session_name: string;
  length: number;
  level: string;
  Session_Drill: SessionDrill[];
  trainer_user_id: number;
}

export interface AthleteSessionItem {
  session_id: number;
  athlete_user_id: number;
  session: Session;
}
