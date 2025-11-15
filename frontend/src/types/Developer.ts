import { Skill } from "./Skill";

export interface Developer {
  id: number;
  name: string;
}


export interface DeveloperDetail {
  id: number;
  name: string;
  skills: Skill[]
}