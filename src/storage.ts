import type { Recipe } from "./types";

const STORAGE_KEY = "coffee-drip-recipes";

export const DEFAULT_RECIPES: Recipe[] = [
  {
    name: "Standard Ratio 1:15 (10g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 10,
    time: {
      "water-g": [30, 90, 150],
      "time-s": [0, 30, 60],
      "done-s": 120,
    },
  },
  {
    name: "Standard Ratio 1:15 (15g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    time: {
      "water-g": [45, 135, 225],
      "time-s": [0, 45, 75],
      "done-s": 135,
    },
  },
  {
    name: "Standard Ratio 1:15 (20g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 20,
    time: {
      "water-g": [60, 180, 300],
      "time-s": [0, 45, 90],
      "done-s": 150,
    },
  },
  {
    name: "James Hoffmann Method",
    ratio: "1:16.6",
    "ratio-coffee": 1,
    "ratio-water": 16.6,
    "coffee-weight-g": 15,
    time: {
      "water-g": [50, 150, 250],
      "time-s": [0, 45, 75],
      "done-s": 210,
    },
  },
  {
    name: "Tetsu Kasuya 4:6 Method",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    time: {
      "water-g": [45, 90, 135, 180, 225],
      "time-s": [0, 45, 90, 135, 165],
      "done-s": 210,
    },
  },
];

// Older saved recipes may predate the `done-s` field. Backfill it from the
// last pour time so the drawdown phase always has a valid target.
const withDoneTime = (recipe: Recipe): Recipe => {
  if (typeof recipe.time["done-s"] === "number") return recipe;
  const times = recipe.time["time-s"];
  const lastTime = times.at(-1) ?? 0;
  return {
    ...recipe,
    time: { ...recipe.time, "done-s": lastTime },
  };
};

export const loadRecipes = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECIPES;
    const parsed = (JSON.parse(raw) as Recipe[]).map(withDoneTime);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_RECIPES;
    const existingNames = new Set(parsed.map((r) => r.name));
    const missing = DEFAULT_RECIPES.filter((r) => !existingNames.has(r.name));
    return missing.length > 0 ? [...missing, ...parsed] : parsed;
  } catch {
    return DEFAULT_RECIPES;
  }
};

export const saveRecipes = (recipes: Recipe[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};
