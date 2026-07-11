import type { Recipe } from "./types";

const STORAGE_KEY = "coffee-drip-recipes";

export const DEFAULT_RECIPES: Recipe[] = [
  {
    name: "Standard Ratio 1:15 (10g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 10,
    "dripper-type": "standard",
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
    "dripper-type": "standard",
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
    "dripper-type": "standard",
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
    "dripper-type": "standard",
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
    "dripper-type": "standard",
    time: {
      "water-g": [45, 90, 135, 180, 225],
      "time-s": [0, 45, 90, 135, 165],
      "done-s": 210,
    },
  },
  {
    name: "Drip on Ice 1:15 (20g Coffee / 150g Ice)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 20,
    "dripper-type": "standard",
    time: {
      "water-g": [40, 100, 150],
      "time-s": [0, 30, 75],
      "done-s": 135, // About 2 minutes 15 seconds
    },
  },
  {
    name: "Iced Standard 1:15 (15g Coffee / 75g Ice)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    "dripper-type": "standard",
    time: {
      "water-g": [45, 100, 150],
      "time-s": [0, 45, 75],
      "done-s": 120,
    },
  },
  {
    name: "Iced Standard 1:15 (20g Coffee / 100g Ice)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 20,
    "dripper-type": "standard",
    time: {
      "water-g": [60, 130, 200],
      "time-s": [0, 45, 90],
      "done-s": 140,
    },
  },
  {
    name: "Iced Tetsu Kasuya (15g Coffee / 90g Ice)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    "dripper-type": "standard",
    time: {
      "water-g": [45, 90, 135],
      "time-s": [0, 45, 90],
      "done-s": 150,
    },
  },
  {
    "name": "Moonstone Fast Extraction (10g)",
    "ratio": "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 10,
    "dripper-type": "standard",
    "time": {
      "water-g": [30, 90, 150],
      "time-s": [0, 30, 50],
      "done-s": 105
    }
  },
  {
    "name": "Moonstone Fast Extraction (15g)",
    "ratio": "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    "dripper-type": "standard",
    "time": {
      "water-g": [45, 135, 225],
      "time-s": [0, 45, 75],
      "done-s": 135
    }
  },
  // ── Hario Switch recipes ──────────────────────────────────────────────
  {
    name: "Hario Switch 1:15 (20g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 20,
    "dripper-type": "switch",
    time: {
      "water-g": [60, 120, 280, 281],
      "time-s": [0, 30, 75, 105],
      "switch-state": ["open", "open", "close", "close", "open"],
      "done-s": 180,
    },
  },
  {
    name: "Switch Hybrid Method (10g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 10,
    "dripper-type": "switch",
    time: {
      "water-g": [75, 150, 150],
      "time-s": [0, 60, 105],
      "switch-state": ["open", "close", "open"],
      "done-s": 135,
    },
  },
  {
    name: "Switch Hybrid Method (15g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 15,
    "dripper-type": "switch",
    time: {
      "water-g": [115, 225, 225],
      "time-s": [0, 75, 120],
      "switch-state": ["open", "close", "open"],
      "done-s": 165,
    },
  },
  {
    name: "Switch Full Immersion (20g)",
    ratio: "1:15",
    "ratio-coffee": 1,
    "ratio-water": 15,
    "coffee-weight-g": 20,
    "dripper-type": "switch",
    time: {
      "water-g": [300, 300],
      "time-s": [0, 120],
      "switch-state": ["close", "open"],
      "done-s": 180,
    },
  },
];

// Older saved recipes may predate the `done-s` field or the `dripper-type`
// field. Backfill them so every recipe always has both.
const migrateRecipe = (recipe: Recipe): Recipe => {
  let patched = recipe;

  // Backfill done-s from the last pour time.
  if (typeof patched.time["done-s"] !== "number") {
    const times = patched.time["time-s"];
    const lastTime = times.at(-1) ?? 0;
    patched = { ...patched, time: { ...patched.time, "done-s": lastTime } };
  }

  // Backfill dripper-type — anything without it is a standard dripper.
  if (!patched["dripper-type"]) {
    patched = { ...patched, "dripper-type": "standard" };
  }

  return patched;
};

export const loadRecipes = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECIPES;
    const parsed = (JSON.parse(raw) as Recipe[]).map(migrateRecipe);
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
