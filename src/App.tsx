import { useEffect, useState } from "react";
import type { Recipe, Screen } from "./types";
import { loadRecipes, saveRecipes } from "./storage";
import RecipeSelect from "./components/RecipeSelect";
import RecipeModal from "./components/RecipeModal";
import RecipeDetailModal from "./components/RecipeDetailModal";
import Timer from "./components/Timer";
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipes());
  const [screen, setScreen] = useState<Screen>("select");
  const [active, setActive] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  const handleStart = (recipe: Recipe) => {
    setActive(recipe);
    setScreen("timer");
  };

  const handleExitTimer = () => {
    setActive(null);
    setScreen("select");
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe]);
    setModalOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-a" aria-hidden />
      <div className="bg-orb bg-orb-b" aria-hidden />
      <div className="bg-orb bg-orb-c" aria-hidden />

      {screen === "select" && (
        <RecipeSelect
          recipes={recipes}
          onStart={handleStart}
          onAddClick={() => setModalOpen(true)}
          onViewDetails={(r) => setDetailRecipe(r)}
        />
      )}

      {screen === "timer" && active && (
        <Timer recipe={active} onExit={handleExitTimer} />
      )}

      <RecipeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRecipe}
      />

      <RecipeDetailModal
        recipe={detailRecipe}
        onClose={() => setDetailRecipe(null)}
        onStart={(r) => {
          setDetailRecipe(null);
          handleStart(r);
        }}
      />
    </div>
  );
};

export default App;
