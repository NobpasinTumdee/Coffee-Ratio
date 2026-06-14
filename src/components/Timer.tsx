import { useEffect, useMemo, useRef, useState } from "react";
import type { Phase, Recipe } from "../types";

interface Props {
  recipe: Recipe;
  onExit: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const Timer = ({ recipe, onExit }: Props) => {
  const waterTargets = recipe.time["water-g"];
  const stepTimes = recipe.time["time-s"];
  const doneTime = recipe.time["done-s"];
  const totalSteps = waterTargets.length;

  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("pouring");
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const id = window.setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== "waiting") return;
    if (stepIndex >= totalSteps) return;
    if (elapsed >= stepTimes[stepIndex]) setPhase("pouring");
  }, [elapsed, phase, stepIndex, stepTimes, totalSteps]);

  // During drawdown the timer keeps running until the recipe's finish time.
  useEffect(() => {
    if (phase !== "drawdown") return;
    if (elapsed >= doneTime) setPhase("done");
  }, [elapsed, phase, doneTime]);

  const handleDone = () => {
    if (stepIndex >= totalSteps - 1) {
      // Final pour complete — wait out the drawdown instead of finishing.
      setPhase(elapsed >= doneTime ? "done" : "drawdown");
      return;
    }
    const next = stepIndex + 1;
    setStepIndex(next);
    setPhase(elapsed >= stepTimes[next] ? "pouring" : "waiting");
  };

  const currentTarget = waterTargets[stepIndex];
  const nextStartTime =
    phase === "waiting" && stepIndex < totalSteps ? stepTimes[stepIndex] : null;
  const previousTarget = stepIndex > 0 ? waterTargets[stepIndex - 1] : 0;

  const waitProgress = useMemo(() => {
    if (phase !== "waiting" || nextStartTime === null) return 0;
    const prevTime = stepIndex > 0 ? stepTimes[stepIndex - 1] : 0;
    const span = nextStartTime - prevTime;
    if (span <= 0) return 1;
    return Math.min(1, Math.max(0, (elapsed - prevTime) / span));
  }, [phase, nextStartTime, elapsed, stepIndex, stepTimes]);

  const totalWater = waterTargets.at(-1) ?? 0;
  const overallProgress =
    phase === "drawdown" || phase === "done"
      ? 1
      : Math.min(1, (previousTarget / totalWater) || 0);

  const drawdownProgress = useMemo(() => {
    if (phase !== "drawdown") return 0;
    const lastPour = stepTimes.at(-1) ?? 0;
    const span = doneTime - lastPour;
    if (span <= 0) return 1;
    return Math.min(1, Math.max(0, (elapsed - lastPour) / span));
  }, [phase, doneTime, elapsed, stepTimes]);

  return (
    <div className={`screen timer-screen phase-${phase}`}>
      <header className="timer-head">
        <button className="btn btn-ghost btn-tiny" onClick={onExit}>
          ← Exit
        </button>
        <span className="timer-recipe-name">{recipe.name}</span>
        <span className="timer-step-count">
          {Math.min(stepIndex + 1, totalSteps)} / {totalSteps}
        </span>
      </header>

      <div className="glass timer-card">
        <span className="phase-pill">
          {phase === "pouring" && "Pouring"}
          {phase === "waiting" && "Wait"}
          {phase === "drawdown" && "Drawdown"}
          {phase === "done" && "Brew Complete"}
        </span>

        <div className="elapsed">{formatTime(elapsed)}</div>

        {phase === "pouring" && (
          <div className="instruction">
            <span className="instruction-label">Pour water up to</span>
            <span className="instruction-value">{currentTarget} g</span>
          </div>
        )}

        {phase === "waiting" && nextStartTime !== null && (
          <div className="instruction">
            <span className="instruction-label">Wait until</span>
            <span className="instruction-value">
              {formatTime(nextStartTime)}
            </span>
            <span className="instruction-sub">
              Next pour: {currentTarget} g
            </span>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${waitProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {phase === "drawdown" && (
          <div className="instruction">
            <span className="instruction-label">Final target reached</span>
            <span className="instruction-value">{totalWater} g</span>
            <span className="instruction-sub">
              Wait for drawdown… finishing at {formatTime(doneTime)}
            </span>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${drawdownProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="instruction">
            <span className="instruction-label">Completed</span>
            <span className="instruction-value">Enjoy your coffee ☕</span>
            <span className="instruction-sub">
              {totalWater} g in {formatTime(doneTime)}
            </span>
          </div>
        )}

        <div className="overall-bar" aria-hidden>
          <div
            className="overall-bar-fill"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>

        <div className="button-row">
          {phase === "pouring" && (
            <button className="btn btn-primary" onClick={handleDone}>
              Done Pouring
            </button>
          )}
          {phase === "waiting" && (
            <button className="btn btn-ghost" disabled>
              Waiting…
            </button>
          )}
          {phase === "drawdown" && (
            <button className="btn btn-ghost" disabled>
              Draining…
            </button>
          )}
          {phase === "done" && (
            <button className="btn btn-primary" onClick={onExit}>
              Finish
            </button>
          )}
          {phase !== "done" && (
            <button className="btn btn-ghost" onClick={onExit}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
