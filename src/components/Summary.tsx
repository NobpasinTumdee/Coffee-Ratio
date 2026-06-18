import { useEffect, useMemo, useRef, useState } from "react";
import type { Recipe, RoastLevel } from "../types";
import successSound from "../sound_effect/success.mp3";

interface Props {
  recipe: Recipe;
  actualTimes: number[];
  onHome: () => void;
}

type Condition = "under" | "perfect" | "over";

const ROAST_LABELS: Record<RoastLevel, string> = {
  light: "Light Roast",
  medium: "Medium Roast",
  dark: "Dark Roast",
};

const CONDITION_INFO: Record<
  Condition,
  { title: string; thai: string; tone: string }
> = {
  under: { title: "Under-Extracted", thai: "สกัดน้อยไป · เร็วกว่ากำหนด", tone: "under" },
  perfect: { title: "Perfect Extraction", thai: "สกัดสมดุล · ตรงเวลา", tone: "perfect" },
  over: { title: "Over-Extracted", thai: "สกัดมากไป · ช้ากว่ากำหนด", tone: "over" },
};

// Estimated taste profile keyed by extraction condition then roast level.
const TASTE_MATRIX: Record<Condition, Record<RoastLevel, string>> = {
  under: {
    light:
      "เปรี้ยวแหลมจัด (Sour/Acidic), บอดี้บางโหวง, สัมผัสได้ถึงรสเค็มเล็กน้อย (Salty), กลิ่นดอกไม้/ผลไม้ออกมาไม่เต็มที่",
    medium:
      "เปรี้ยวโดด, ขาดความหวาน (Lacks sweetness), รสชาติไม่กลมกล่อม, ทิ้งความรู้สึกสากๆ ไว้ที่ปลายลิ้น",
    dark:
      "จืดชืด (Weak/Watery), กลิ่นหอมจางหาย, อาจมีรสขมของเถ้าควัน (Ashy) ลอยขึ้นมาโดยไม่มีความหวานรองรับ",
  },
  perfect: {
    light:
      "สมดุลยอดเยี่ยม (Excellent Balance), เปรี้ยวสว่างแบบผลไม้ (Bright acidity), กลิ่นดอกไม้/ผลไม้ชัดเจน, หวานฉ่ำทิ้งท้าย (Sweet finish)",
    medium:
      "กลมกล่อม (Well-balanced), หวานนำคล้ายคาราเมลหรือช็อกโกแลต, บอดี้เนียนนุ่มกำลังดี",
    dark:
      "บอดี้หนักแน่น (Full body), หวานลึก, ขมนุ่มนวลแบบดาร์กช็อกโกแลต, ไม่ทิ้งความฝาดคอ",
  },
  over: {
    light:
      "สูญเสียกลิ่นหอมเฉพาะตัว, รสเปรี้ยวถูกกลืนหายไป, มีความฝาดแห้งคอ (Astringent/Dry) แทรกเข้ามาแทนที่ความหวาน",
    medium:
      "ขมนำ (Bitter), บอดี้หนักเกินไปจนรู้สึกขุ่น (Muddy), รสชาติแบนราบไม่ซับซ้อน (Flat)",
    dark:
      "ขมจัดจนฝืดคอ (Harshly bitter), มีกลิ่นไหม้ชัดเจน (Burnt), รสชาติเข้มกระแทกจนดื่มยาก",
  },
};

const stepLabel = (i: number): string => (i === 0 ? "Bloom" : `Pour ${i + 1}`);

const Summary = ({ recipe, actualTimes, onHome }: Props) => {
  const [roast, setRoast] = useState<RoastLevel>("medium");

  // Celebrate the finished brew on mount (the Timer unmounts before its own
  // success cue can be heard once the screen hands off to this analysis view).
  const successRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = new Audio(successSound);
    successRef.current = audio;
    void audio.play().catch(() => {});
    return () => {
      audio.pause();
      successRef.current = null;
    };
  }, []);

  const stepTimes = recipe.time["time-s"];
  const doneTime = recipe.time["done-s"];

  const analysis = useMemo(() => {
    // One comparison point per pour: ideal scheduled time vs the user's click.
    const count = Math.min(stepTimes.length, actualTimes.length);
    const points = Array.from({ length: count }, (_, i) => {
      const ideal = stepTimes[i];
      const actual = actualTimes[i];
      return { label: stepLabel(i), ideal, actual, diff: actual - ideal };
    });

    const totalIdeal = points.reduce((sum, p) => sum + p.ideal, 0);
    const totalVariance = points.reduce((sum, p) => sum + Math.abs(p.diff), 0);
    const signedTotal = points.reduce((sum, p) => sum + p.diff, 0);

    // Score: full marks at zero variance, scaled against the total schedule.
    const score = Math.max(
      0,
      Math.min(100, Math.round(100 - (totalVariance / Math.max(totalIdeal, 1)) * 100)),
    );

    // Direction relative to the schedule decides the extraction condition.
    const ratio = totalIdeal > 0 ? signedTotal / totalIdeal : 0;
    let condition: Condition = "perfect";
    let pace = "Spot On";
    if (ratio < -0.1) {
      condition = "under";
      pace = "Too Fast";
    } else if (ratio > 0.1) {
      condition = "over";
      pace = "Too Slow";
    }

    // Chart series include a converging "Finish" point at done-s.
    const chart = [
      ...points.map((p) => ({ label: p.label, ideal: p.ideal, actual: p.actual })),
      { label: "Finish", ideal: doneTime, actual: doneTime },
    ];

    return { points, totalVariance, signedTotal, score, condition, pace, chart };
  }, [stepTimes, actualTimes, doneTime]);

  const { score, condition, pace, chart, points, totalVariance } = analysis;
  const scoreTone = score >= 85 ? "good" : score >= 60 ? "ok" : "poor";
  const conditionInfo = CONDITION_INFO[condition];

  // --- Circular score gauge geometry ---
  const ring = 52;
  const circumference = 2 * Math.PI * ring;
  const dashOffset = circumference * (1 - score / 100);

  // --- Line chart geometry (responsive via viewBox) ---
  const chartW = 320;
  const chartH = 210;
  const padL = 32;
  const padR = 14;
  const padT = 16;
  const padB = 34;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const maxVal = Math.max(...chart.map((c) => Math.max(c.ideal, c.actual)), 1);
  const niceMax = Math.ceil(maxVal / 30) * 30 || 30;
  const px = (i: number) =>
    chart.length <= 1 ? padL + innerW / 2 : padL + (i / (chart.length - 1)) * innerW;
  const py = (v: number) => padT + innerH - (v / niceMax) * innerH;
  const idealPoly = chart.map((c, i) => `${px(i)},${py(c.ideal)}`).join(" ");
  const actualPoly = chart.map((c, i) => `${px(i)},${py(c.actual)}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));

  return (
    <div className="screen summary-screen">
      <header className="summary-head">
        <h2 className="summary-title">Brew Analysis</h2>
        <span className="summary-recipe">{recipe.name}</span>
      </header>

      {/* Accuracy score */}
      <div className="glass card summary-block">
        <span className="field-label">Accuracy Score</span>
        <div className="score-wrap">
          <div className={`score-gauge tone-${scoreTone}`}>
            <svg viewBox="0 0 120 120" className="score-svg" aria-hidden>
              <circle className="score-track" cx="60" cy="60" r={ring} />
              <circle
                className="score-value"
                cx="60"
                cy="60"
                r={ring}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="score-readout">
              <span className="score-number">{score}</span>
              <span className="score-pct">%</span>
            </div>
          </div>
          <div className="score-meta">
            <span className={`pace-pill pace-${condition}`}>{pace}</span>
            <p className="score-note">
              Total timing variance of <strong>{Math.round(totalVariance)}s</strong>{" "}
              across {points.length} pour{points.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>
      </div>

      {/* Ideal vs actual line chart */}
      <div className="glass card summary-block">
        <span className="field-label">Ideal vs Actual Timeline</span>
        <svg
          className="accuracy-chart"
          viewBox={`0 0 ${chartW} ${chartH}`}
          role="img"
          aria-label="Line chart comparing ideal and actual pour times"
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line
                className="chart-grid"
                x1={padL}
                x2={chartW - padR}
                y1={py(t)}
                y2={py(t)}
              />
              <text className="chart-axis-label" x={padL - 6} y={py(t) + 3} textAnchor="end">
                {t}
              </text>
            </g>
          ))}

          <polyline className="chart-line-ideal" points={idealPoly} />
          <polyline className="chart-line-actual" points={actualPoly} />

          {chart.map((c, i) => (
            <g key={c.label}>
              <circle className="chart-dot-ideal" cx={px(i)} cy={py(c.ideal)} r="3.5" />
              <circle className="chart-dot-actual" cx={px(i)} cy={py(c.actual)} r="3.5" />
              <text
                className="chart-axis-label"
                x={px(i)}
                y={chartH - 12}
                textAnchor="middle"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-swatch legend-ideal" /> Ideal
          </span>
          <span className="legend-item">
            <span className="legend-swatch legend-actual" /> Actual
          </span>
          <span className="legend-axis">seconds</span>
        </div>
      </div>

      {/* Taste profile prediction */}
      <div className="glass card summary-block">
        <span className="field-label">Estimated Taste Profile</span>

        <div className="roast-toggle" role="group" aria-label="Roast level">
          {(["light", "medium", "dark"] as RoastLevel[]).map((r) => (
            <button
              key={r}
              className={`roast-option${roast === r ? " is-active" : ""}`}
              onClick={() => setRoast(r)}
              aria-pressed={roast === r}
            >
              {ROAST_LABELS[r]}
            </button>
          ))}
        </div>

        <div className={`taste-card taste-${conditionInfo.tone}`}>
          <div className="taste-head">
            <span className="taste-condition">{conditionInfo.title}</span>
            <span className="taste-condition-th">{conditionInfo.thai}</span>
          </div>
          <p className="taste-body">{TASTE_MATRIX[condition][roast]}</p>
        </div>
      </div>

      <button className="btn btn-primary summary-home" onClick={onHome}>
        ← Back to Home
      </button>
    </div>
  );
};

export default Summary;
