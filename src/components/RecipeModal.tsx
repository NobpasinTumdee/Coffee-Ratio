import { useEffect, useState } from "react";
import type { Recipe } from "../types";

interface PourStep {
  water: string;
  time: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

const emptyStep = (): PourStep => ({ water: "", time: "" });

const RecipeModal = ({ open, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [coffee, setCoffee] = useState("15");
  const [ratio, setRatio] = useState("16");
  const [steps, setSteps] = useState<PourStep[]>([
    { water: "30", time: "0" },
    { water: "", time: "" },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setCoffee("15");
    setRatio("16");
    setSteps([
      { water: "30", time: "0" },
      { water: "", time: "" },
    ]);
    setError(null);
  }, [open]);

  if (!open) return null;

  const updateStep = (i: number, key: keyof PourStep, value: string) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  };

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const trimmedName = name.trim();
    const coffeeNum = Number(coffee);
    const ratioNum = Number(ratio);

    if (!trimmedName) return setError("Please give the recipe a name.");
    if (!Number.isFinite(coffeeNum) || coffeeNum <= 0)
      return setError("Coffee weight must be a positive number.");
    if (!Number.isFinite(ratioNum) || ratioNum <= 0)
      return setError("Water ratio must be a positive number.");

    const cleanSteps = steps
      .map((s) => ({ water: Number(s.water), time: Number(s.time) }))
      .filter(
        (s) =>
          Number.isFinite(s.water) &&
          Number.isFinite(s.time) &&
          s.water > 0,
      );

    if (cleanSteps.length === 0)
      return setError("Add at least one pour step.");

    for (let i = 1; i < cleanSteps.length; i++) {
      if (cleanSteps[i].time < cleanSteps[i - 1].time) {
        return setError("Pour times must increase down the list.");
      }
      if (cleanSteps[i].water <= cleanSteps[i - 1].water) {
        return setError("Target water must increase down the list.");
      }
    }

    const recipe: Recipe = {
      name: trimmedName,
      ratio: `1:${ratioNum}`,
      "ratio-coffee": 1,
      "ratio-water": ratioNum,
      "coffee-weight-g": coffeeNum,
      time: {
        "water-g": cleanSteps.map((s) => s.water),
        "time-s": cleanSteps.map((s) => s.time),
      },
    };

    onSave(recipe);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="glass modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-head">
          <h2 id="modal-title">New Recipe</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        <div className="modal-body">
          <label className="field">
            <span className="field-label">Recipe Name</span>
            <input
              className="glass-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning V60"
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span className="field-label">Coffee (g)</span>
              <input
                className="glass-input"
                type="number"
                min="0"
                step="0.1"
                value={coffee}
                onChange={(e) => setCoffee(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">Water Ratio (1:n)</span>
              <input
                className="glass-input"
                type="number"
                min="0"
                step="0.1"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
              />
            </label>
          </div>

          <div className="steps-section">
            <div className="steps-head">
              <span className="field-label">Pour Steps</span>
              <button
                type="button"
                className="btn btn-tiny"
                onClick={addStep}
              >
                + Add Step
              </button>
            </div>

            <ul className="step-list">
              {steps.map((s, i) => (
                <li key={i} className="step-row">
                  <span className="step-num">{i + 1}</span>
                  <input
                    className="glass-input"
                    type="number"
                    min="0"
                    placeholder="Water (g)"
                    value={s.water}
                    onChange={(e) => updateStep(i, "water", e.target.value)}
                  />
                  <span className="step-at">@</span>
                  <input
                    className="glass-input"
                    type="number"
                    min="0"
                    placeholder="Time (s)"
                    value={s.time}
                    onChange={(e) => updateStep(i, "time", e.target.value)}
                  />
                  <button
                    type="button"
                    className="icon-btn small"
                    onClick={() => removeStep(i)}
                    aria-label={`Remove step ${i + 1}`}
                    disabled={steps.length <= 1}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>

        <footer className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Recipe
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RecipeModal;
