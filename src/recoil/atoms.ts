import { atom } from 'recoil';

// Basic Todo interface
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 1. Array atom (your existing todo list)
export const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [],
});

// 2. String atom (for filter/search)
export const filterState = atom<string>({
  key: 'filterState',
  default: 'all', // 'all', 'active', 'completed'
});

// 3. Number atom (for statistics)
export const todoCountState = atom<number>({
  key: 'todoCountState',
  default: 0,
});

// 4. Boolean atom (for UI state)
export const isDarkModeState = atom<boolean>({
  key: 'isDarkModeState',
  default: false,
});

// 5. Object atom (for user preferences)
export const userPreferencesState = atom<{
  language: string;
  notifications: boolean;
  theme: string;
}>({
  key: 'userPreferencesState',
  default: {
    language: 'en',
    notifications: true,
    theme: 'light'
  }
});
