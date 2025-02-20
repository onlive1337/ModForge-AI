export interface AIAnalysis {
  features: string[];
  searchTerms: string[];
  modTypes: string[];
  requiredMods: string[];
  resourcePacks?: string[];
  shaders?: string[];
}

export interface Dependency {
  name: string;
  slug?: string;
  required: boolean;
}

export interface ModItem {
  name: string;
  description: string;
  downloads: number;
  projectId: string;
  slug: string;
  author: string;
  type: 'mod' | 'resourcepack' | 'shader';
  dependencies?: Dependency[];
}

export interface ModpackResponse {
  prompt: string;
  minecraftVersion: string;
  analysis: {
    features: string[];
    modTypes: string[];
  };
  mods: ModItem[];
  resourcePacks?: ModItem[];
  shaders?: ModItem[];
  notFound?: string[];
}

export type ModLoader = 'forge' | 'fabric' | 'quilt' | 'neoforge';

export interface VersionOption {
  version: string;
  loaders: ModLoader[];
}

export interface LogEntry {
  id: number;
  message: string;
  status: 'pending' | 'success' | 'error';
  details?: string;
  timestamp: string;
}

export interface UserSettings {
  defaultLoader: 'forge' | 'fabric' | 'quilt' | 'neoforge';
  defaultVersion: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ru';
}

export interface User {
  id: string;
  username: string;
  email: string;
  settings: UserSettings;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}