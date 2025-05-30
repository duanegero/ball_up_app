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
