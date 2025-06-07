// import { create } from 'zustand';

// interface User {
//   id: number;
//   name: string;
//   role: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   skills?: string[];     
//   seniority?: string;      
//   max_capacity?: number;   
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,
//   setUser: (user) => set({ user }),
//   setToken: (token) => set({ token }),
// }));

import { create } from 'zustand';

interface User {
  engineerId: string;
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  skills?: string[];
  seniority?: string;
  maxCapacity?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));

