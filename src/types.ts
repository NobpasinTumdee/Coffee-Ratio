export interface RecipeStep {
  "water-g": number[];
  "time-s": number[];
  "done-s": number;
}

export interface Recipe {
  name: string;
  ratio: string;
  "ratio-coffee": number;
  "ratio-water": number;
  "coffee-weight-g": number;
  time: RecipeStep;
}

export type Phase = "pouring" | "waiting" | "drawdown" | "done";

export type Screen = "select" | "timer" | "summary";

export type RoastLevel = "light" | "medium" | "dark";

// In-memory result of a finished brew. Never persisted — recomputed per session.
export interface BrewResult {
  recipe: Recipe;
  // Exact elapsed seconds captured at each "Done Pouring" click, in order.
  actualTimes: number[];
}
