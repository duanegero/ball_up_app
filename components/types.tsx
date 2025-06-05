export interface Trainer {
  trainer_user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  years_experience: number;
  bio: string;
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
  drill_name: any;
  drill_id: number;
  drill_type: string;
  description: string;
  level: string;
  trainer_user_id: number;
}

export type SessionDrill = {
  drill_id: number;
  session_id: number;
  drill: Drill;
};

export interface Session {
  session_id: number;
  session_name: string;
  length: number;
  level: string;
  Session_Drill: SessionDrill[];
  trainer_user_id: number;
}

export interface AthleteSessionItem {
  athlete_user_id: number;
  session_id: number;
  completed: boolean;
  session: {
    level: number;
    length: number;
    session_name: string;
    Session_Drill: {
      drill: {
        drill_id: any;
        level: number;
        drill_type: string;
        description: string;
      };
    }[];
  };
}

export type DrillResponse = {
  message: string;
  newDrill: {
    drill_id: number;
    drill_name: string;
    drill_type: string;
    description: string;
    level: number;
    trainer_user_id: number;
    created_at: string;
  };
};
