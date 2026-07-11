# Coffee Ratio

A coffee brewing timer and recipe management web application built with React, TypeScript, and Vite. This application allows users to create, select, and time their coffee brewing recipes, capturing actual brew times and providing a summary at the end of the process.

## Features

- **Recipe Management**: Create and save your custom coffee brew recipes.
- **Brew Timer**: A built-in timer to guide you through the brewing steps.
- **Brew Summary**: Review your actual brewing times against the planned recipe after finishing.
- **Persistent Storage**: Recipes and data are saved locally on your browser.

## Technologies Used

- React 19
- TypeScript
- Vite
- LocalStorage for state persistence

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation & Running Locally

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

Here is the complete file structure of the project (excluding `node_modules` and `.git`):

```text
coffee-ratio/
├── .vscode/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── RecipeDetailModal.tsx
│   │   ├── RecipeModal.tsx
│   │   ├── RecipeSelect.tsx
│   │   ├── Summary.tsx
│   │   └── Timer.tsx
│   ├── sound_effect/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── storage.ts
│   └── types.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```


# Add Hario Switch Dripper Support

Add full support for the "Hario Switch" dripper mechanism: updated data types, a dripper-type filter toggle on the main screen, and a specialized Timer UI that displays switch state (open/close) with contextual pour vs flip instructions.

## Proposed Changes

### 1. Types & Data Layer

#### [MODIFY] [types.ts](file:///t:/GitHub/coffee-ratio/src/types.ts)
- Add `SwitchState` type: `"open" | "close"`.
- Add optional `"switch-state"?: SwitchState[]` to `RecipeStep`.
- Add `"dripper-type": "standard" | "switch"` to `Recipe`.
- Ensure all imports of types across the codebase use `import type` (already done in most places — the existing code already uses `import type`, just need to verify no value-import of pure types).

#### [MODIFY] [storage.ts](file:///t:/GitHub/coffee-ratio/src/storage.ts)
- Add `"dripper-type": "standard"` to **all** existing default recipes.
- **Remove** the old "Hario Switch 1:15 (20g)" recipe (it has no `switch-state` and used a hacky +1g trick).
- **Add 3 new Hario Switch recipes** from the user's specification:
  - Switch Hybrid Method (10g)
  - Switch Hybrid Method (15g)
  - Switch Full Immersion (20g)
- Extend the `withDoneTime` migration helper to also backfill `"dripper-type": "standard"` on old saved recipes that lack the field.

---

### 2. Main Screen — Dripper Type Toggle

#### [MODIFY] [RecipeSelect.tsx](file:///t:/GitHub/coffee-ratio/src/components/RecipeSelect.tsx)
- Add a `dripperType` local state: `"standard" | "switch"` (default `"standard"`).
- Render a **Dripper Type Toggle** at the top of the recipe card (using the same `roast-toggle` pattern from Summary). Two segments:
  - "☕ Standard V60 / Flat Bottom"
  - "🔄 Hario Switch"
- Filter `recipes` by the selected `dripperType` before rendering the dropdown.
- Reset `selectedIndex` to `0` whenever `dripperType` changes.

#### [MODIFY] [App.css](file:///t:/GitHub/coffee-ratio/src/App.css)
- Add `.dripper-toggle` styles reusing the `roast-toggle` pattern (already exists).

---

### 3. Timer UI — Hario Switch Specialization

#### [MODIFY] [Timer.tsx](file:///t:/GitHub/coffee-ratio/src/components/Timer.tsx)
- Detect `isSwitch = recipe["dripper-type"] === "switch"`.
- Read `switchStates = recipe.time["switch-state"]` array.
- **Big Switch Status Indicator** (center of timer card, above instruction):
  - When `switchStates[stepIndex] === "close"`: Red/Orange glowing pill with `🔒 SWITCH CLOSED (Immersion/แช่น้ำ)`.
  - When `switchStates[stepIndex] === "open"`: Blue/Green glowing pill with `🔓 SWITCH OPEN (Drawdown/น้ำไหล)`.
  - Use CSS transitions for smooth color/glow changes between states.
- **Action Context Logic** (replaces the standard "Pour water up to" instruction for Switch recipes):
  - If `currentTarget > previousTarget` (water increased): Show "Pour to **{currentTarget}g**" — same as standard behavior.
  - If `currentTarget === previousTarget` (no water change): Show `"ACTION: Flip the switch to [OPEN/CLOSE]"` in bold, instead of a pour instruction.
- The "Done Pouring" button text changes to "Done ✓" (generic) for switch recipes since the user may be confirming a pour OR a switch flip.
- Drawdown/done phases remain identical to the standard timer.
- Timeline nodes for switch recipes show switch state changes: e.g., "🔒 Close → Pour to 75g" or "🔓 Open Switch".

#### [MODIFY] [App.css](file:///t:/GitHub/coffee-ratio/src/App.css)
Add styles for the switch indicator and its two states:
- `.switch-indicator` — centered pill/badge, large font, prominent.
- `.switch-indicator.is-closed` — warm red/orange glow, locked icon styling.
- `.switch-indicator.is-open` — cool blue/green glow, unlocked icon styling.
- Smooth CSS transitions on `background`, `color`, `box-shadow`, `border-color`.
- `.switch-action` — bold text style for "ACTION: Flip the switch" instruction.

---

### 4. Recipe Detail Modal Update

#### [MODIFY] [RecipeDetailModal.tsx](file:///t:/GitHub/coffee-ratio/src/components/RecipeDetailModal.tsx)
- For switch recipes, show the switch state per step in the pour schedule (e.g., "🔒 Close → Pour to 75g" or "🔓 Open Switch — no pour").

---

### 5. Recipe Modal (Add Custom Recipe) — Minor Update

#### [MODIFY] [RecipeModal.tsx](file:///t:/GitHub/coffee-ratio/src/components/RecipeModal.tsx)
- Add a `"dripper-type": "standard"` field to newly created recipes.
- (Full Switch recipe creation UI is out of scope for now — users get Switch recipes from defaults.)

---

## Verification Plan

### Automated Tests
```bash
npx tsc --noEmit
npm run build
```

### Manual Verification
- Run dev server and verify:
  1. Dripper toggle appears on main screen; switching filters recipes correctly.
  2. Standard recipes work exactly as before (no regression).
  3. Switch recipes show the Big Switch Status Indicator with correct open/close states.
  4. Steps where water doesn't change show "ACTION: Flip the switch" instead of pour instructions.
  5. Smooth CSS transitions between switch states.
  6. Timeline shows switch state info for switch recipes.
  7. RecipeDetailModal shows switch state per step for switch recipes.

