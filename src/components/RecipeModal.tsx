import { useEffect, useState } from "react";
import type { Recipe, SwitchState } from "../types";

interface PourStep {
  water: string;
  time: string;
  switchState: SwitchState;
}

type DripperType = "standard" | "switch";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

const emptyStep = (dripper: DripperType): PourStep => ({
  water: "",
  time: "",
  switchState: dripper === "switch" ? "open" : "open",
});

const RecipeModal = ({ open, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [coffee, setCoffee] = useState("15");
  const [ratio, setRatio] = useState("16");
  const [done, setDone] = useState("120");
  const [dripperType, setDripperType] = useState<DripperType>("standard");
  const [steps, setSteps] = useState<PourStep[]>([
    { water: "30", time: "0", switchState: "open" },
    { water: "", time: "", switchState: "open" },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setCoffee("15");
    setRatio("16");
    setDone("120");
    setDripperType("standard");
    setSteps([
      { water: "30", time: "0", switchState: "open" },
      { water: "", time: "", switchState: "open" },
    ]);
    setError(null);
  }, [open]);

  if (!open) return null;

  const isSwitch = dripperType === "switch";

  const updateStep = (i: number, key: keyof PourStep, value: string) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  };

  const addStep = () => setSteps((prev) => [...prev, emptyStep(dripperType)]);
  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const trimmedName = name.trim();
    const coffeeNum = Number(coffee);
    const ratioNum = Number(ratio);
    const doneNum = Number(done);

    if (!trimmedName) return setError("Please give the recipe a name.");
    if (!Number.isFinite(coffeeNum) || coffeeNum <= 0)
      return setError("Coffee weight must be a positive number.");
    if (!Number.isFinite(ratioNum) || ratioNum <= 0)
      return setError("Water ratio must be a positive number.");
    if (!Number.isFinite(doneNum) || doneNum <= 0)
      return setError("Total finish time must be a positive number.");

    const cleanSteps = steps
      .map((s) => ({
        water: Number(s.water),
        time: Number(s.time),
        switchState: s.switchState,
      }))
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
      if (isSwitch) {
        // Switch recipes allow equal water (flip-only steps), but not decreasing.
        if (cleanSteps[i].water < cleanSteps[i - 1].water) {
          return setError("Target water cannot decrease down the list.");
        }
      } else {
        if (cleanSteps[i].water <= cleanSteps[i - 1].water) {
          return setError("Target water must increase down the list.");
        }
      }
    }

    const lastPourTime = cleanSteps.at(-1)?.time ?? 0;
    if (doneNum < lastPourTime) {
      return setError("Total finish time must be after the last pour.");
    }

    const recipe: Recipe = {
      name: trimmedName,
      ratio: `1:${ratioNum}`,
      "ratio-coffee": 1,
      "ratio-water": ratioNum,
      "coffee-weight-g": coffeeNum,
      "dripper-type": dripperType,
      time: {
        "water-g": cleanSteps.map((s) => s.water),
        "time-s": cleanSteps.map((s) => s.time),
        ...(isSwitch
          ? { "switch-state": cleanSteps.map((s) => s.switchState) }
          : {}),
        "done-s": doneNum,
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
          {/* Dripper type toggle */}
          <div className="field">
            <span className="field-label">Dripper Type</span>
            <div
              className="dripper-toggle"
              role="group"
              aria-label="Dripper type"
            >
              <button
                type="button"
                className={`dripper-option${dripperType === "standard" ? " is-active" : ""}`}
                onClick={() => setDripperType("standard")}
                aria-pressed={dripperType === "standard"}
              >
                ☕ Standard V60
              </button>
              <button
                type="button"
                className={`dripper-option${dripperType === "switch" ? " is-active" : ""}`}
                onClick={() => setDripperType("switch")}
                aria-pressed={dripperType === "switch"}
              >
                🔄 Hario Switch
              </button>
            </div>
          </div>

          <label className="field">
            <span className="field-label">Recipe Name</span>
            <input
              className="glass-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isSwitch ? "e.g. Switch Immersion" : "e.g. Morning V60"}
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

          <label className="field">
            <span className="field-label">Total time to finish (s)</span>
            <input
              className="glass-input"
              type="number"
              min="0"
              step="1"
              value={done}
              onChange={(e) => setDone(e.target.value)}
              placeholder="e.g. 120"
            />
            <span className="field-hint">
              When the water should finish draining (drawdown).
            </span>
          </label>

          <div className="steps-section">
            <div className="steps-head">
              <span className="field-label">
                {isSwitch ? "Steps (Pour & Switch)" : "Pour Steps"}
              </span>
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
                <li key={i} className={isSwitch ? "step-row step-row-switch" : "step-row"}>
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
                  {isSwitch && (
                    <div className="select-wrap step-switch-select">
                      <select
                        className="glass-input"
                        value={s.switchState}
                        onChange={(e) =>
                          updateStep(i, "switchState", e.target.value)
                        }
                        aria-label={`Switch state for step ${i + 1}`}
                      >
                        <option value="open">🔓 Open</option>
                        <option value="close">🔒 Close</option>
                      </select>
                    </div>
                  )}
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

            {isSwitch && (
              <span className="field-hint">
                Set the same water amount as the previous step for a "flip-only" action.
              </span>
            )}
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
