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
    },
  },
];

export const loadRecipes = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECIPES;
    const parsed = JSON.parse(raw) as Recipe[];
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
