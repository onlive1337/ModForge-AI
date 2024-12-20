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