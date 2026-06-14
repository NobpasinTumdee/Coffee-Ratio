import { useState } from "react";
import type { Recipe } from "../types";
import brandMark from "../assets/quick-coffee-png.png";

interface Props {
  recipes: Recipe[];
  onStart: (recipe: Recipe) => void;
  onAddClick: () => void;
  onViewDetails: (recipe: Recipe) => void;
}

const RecipeSelect = ({ recipes, onStart, onAddClick, onViewDetails }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = recipes[selectedIndex];
  const waterTotal = selected?.time["water-g"].at(-1) ?? 0;

  return (
    <div className="screen select-screen">
      <header className="brand">
        <img className="brand-mark" src={brandMark} alt="" aria-hidden />
        <h1>Coffee Drip Timer</h1>
        <p className="brand-sub">Pick a recipe, follow the pour.</p>
      </header>

      <section className="glass card recipe-card">
        <label className="field-label" htmlFor="recipe-select">
          Recipe
        </label>
        <div className="select-wrap">
          <select
            id="recipe-select"
            className="glass-input"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {recipes.map((r, i) => (
              <option key={`${r.name}-${i}`} value={i}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <button
            type="button"
            className="recipe-summary recipe-summary-button"
            onClick={() => onViewDetails(selected)}
            aria-label={`View details for ${selected.name}`}
          >
            <div className="stat">
              <span className="stat-label">Ratio</span>
              <span className="stat-value">{selected.ratio}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Coffee</span>
              <span className="stat-value">{selected["coffee-weight-g"]} g</span>
            </div>
            <div className="stat">
              <span className="stat-label">Water</span>
              <span className="stat-value">{waterTotal} g</span>
            </div>
            <div className="stat">
              <span className="stat-label">Pours</span>
              <span className="stat-value">{selected.time["water-g"].length}</span>
            </div>
            <span className="recipe-summary-hint">View pour schedule →</span>
          </button>
        )}

        <div className="button-row">
          <button
            className="btn btn-primary"
            onClick={() => selected && onStart(selected)}
            disabled={!selected}
          >
            Start Brew
          </button>
          <button className="btn btn-ghost" onClick={onAddClick}>
            + Add Custom Recipe
          </button>
        </div>
      </section>
    </div>
  );
};

export default RecipeSelect;
