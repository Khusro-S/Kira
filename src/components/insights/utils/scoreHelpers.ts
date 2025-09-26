// Helper functions for converting user-friendly strings to numeric scores for charting

export function getMoodScore(mood: string): number {
  const scores = { great: 5, good: 4, okay: 3, low: 2, irritable: 1 };
  return scores[mood as keyof typeof scores] || 3;
}

export function getEnergyScore(energy: string): number {
  const scores = { high: 5, medium: 3, low: 1 };
  return scores[energy as keyof typeof scores] || 3;
}

export function getFlowScore(flow: string): number {
  const scores = { heavy: 5, medium: 4, light: 3, spotting: 2, none: 1 };
  return scores[flow as keyof typeof scores] || 1;
}

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Great";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Okay";
  if (score >= 1.5) return "Low";
  return "Poor";
}

export function getFlowLabel(score: number): string {
  if (score === 5) return "Heavy";
  if (score === 4) return "Medium";
  if (score === 3) return "Light";
  if (score === 2) return "Spotting";
  return "None";
}

// Common interface for daily tracking data
export interface DailyData {
  date: string;
  flow?: string;
  mood?: string;
  energy?: string;
  sleep?: number;
  symptoms?: string[];
  notes?: string;
}

// Time range options for filtering data
export type TimeRange = "30days" | "3months" | "6months" | "1year";
