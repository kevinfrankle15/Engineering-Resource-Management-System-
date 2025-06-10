export type Role = 'manager' | 'engineer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  skills: string[];
  seniority: 'junior' | 'mid' | 'senior';
  maxCapacity: number;
}

export interface Project {
  _id: number;
  name: string;
  description?: string;
  requiredSkills?: string[];
  startDate?: string;
  endDate?: string;
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

export interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
}

export interface AssignmentE {
   _id: string;
  engineer_id: string;
  project_id: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  role: string;
}
