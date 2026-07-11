import type { Recipe } from "../types";

interface Props {
  recipe: Recipe | null;
  onClose: () => void;
  onStart: (recipe: Recipe) => void;
}

const formatTime = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const RecipeDetailModal = ({ recipe, onClose, onStart }: Props) => {
  if (!recipe) return null;

  const waters = recipe.time["water-g"];
  const times = recipe.time["time-s"];
  const doneTime = recipe.time["done-s"];
  const totalWater = waters.at(-1) ?? 0;
  const isSwitch = recipe["dripper-type"] === "switch";
  const switchStates = recipe.time["switch-state"];

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="glass modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header className="modal-head">
          <h2 id="detail-title">{recipe.name}</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </header>

        <div className="modal-body">
          <div className="recipe-summary">
            <div className="stat">
              <span className="stat-label">Ratio</span>
              <span className="stat-value">{recipe.ratio}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Coffee</span>
              <span className="stat-value">{recipe["coffee-weight-g"]} g</span>
            </div>
            <div className="stat">
              <span className="stat-label">Water</span>
              <span className="stat-value">{totalWater} g</span>
            </div>
            <div className="stat">
              <span className="stat-label">Pours</span>
              <span className="stat-value">{waters.length}</span>
            </div>
          </div>

          <div className="steps-section">
            <span className="field-label">Pour Schedule</span>
            <ol className="schedule-list">
              {waters.map((target, i) => {
                const prev = i > 0 ? waters[i - 1] : 0;
                const add = target - prev;
                const switchState = isSwitch && switchStates ? switchStates[i] : null;
                const isFlip = isSwitch && target === prev && i > 0;
                const stateIcon = switchState === "close" ? "🔒" : switchState === "open" ? "🔓" : switchState === "waiting" ? "⏳" : "";

                return (
                  <li key={i} className="schedule-row">
                    <span className="schedule-num">{i + 1}</span>
                    <div className="schedule-main">
                      <span className="schedule-target">
                        {isFlip ? (
                          <>
                            {stateIcon} Flip Switch to{" "}
                            <strong>{switchState === "close" ? "CLOSE" : "OPEN"}</strong>
                            <span className="schedule-add"> (no pour)</span>
                          </>
                        ) : (
                          <>
                            {stateIcon && `${stateIcon} `}Pour to{" "}
                            <strong>{target} g</strong>
                            <span className="schedule-add">(+{add} g)</span>
                          </>
                        )}
                      </span>
                      <span className="schedule-time">
                        Start @ {formatTime(times[i])}
                      </span>
                    </div>
                  </li>
                );
              })}
              <li className="schedule-row">
                <span className="schedule-num">✓</span>
                <div className="schedule-main">
                  <span className="schedule-target">
                    <strong>Drawdown complete</strong>
                  </span>
                  <span className="schedule-time">
                    Finish @ {formatTime(doneTime)}
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <footer className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onStart(recipe)}
          >
            Start Brew
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
