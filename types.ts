export enum LuxuryLevel {
  BUDGET = "Budget",
  MODERATE = "Moderate",
  LUXURY = "Luxury"
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  costEstimate: number;
  type: 'food' | 'transport' | 'accommodation' | 'activity' | 'other';
  location: string;
  coordinates: Coordinates;
}

export interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  activities: Activity[];
}

export interface CostBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  hiddenCosts: number;
  total: number;
}

export interface TripPlan {
  tripName: string;
  destination: string;
  duration: number;
  summary: string;
  days: DayPlan[];
  costBreakdown: CostBreakdown;
  luxuryScore: number; // 1-10
  timeEfficiencyScore: number; // 1-10
}

export interface TripPreferences {
  origin: string;
  destinations: string[];
  duration: number;
  budget: number;
  travelers: number;
  luxuryLevel: LuxuryLevel;
  interests: string;
}