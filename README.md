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
