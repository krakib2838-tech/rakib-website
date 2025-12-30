

export interface ServerConfig {
  id: string;
  name: string;
  apiKey: string;
  region: string;
  order: number;
}

export interface Emote {
  id: string;
  emoteId: string; // The ID sent to the API (e.g., 'hello_emote')
  name: string;    // Display name
  imageUrl: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface SocialLinks {
  telegram: string;
  youtube: string;
  instagram: string;
  discord?: string;
  github?: string;
}

export interface AppConfig {
  accessKey: string;
  maintenanceMode: boolean;
  videoLink: string;
  emoteApiUrl: string; // The base URL for the emote API
  logoUrl?: string; // URL for the branding logo
  adminPassword?: string; // Stored securely
  socialLinks?: SocialLinks;
}

export interface DailyAnalytics {
  date: string;
  pageViews: number;
  activeUsers: number;
  newUsers: number;
  emoteSends: number;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
  MAINTENANCE = 'MAINTENANCE'
}