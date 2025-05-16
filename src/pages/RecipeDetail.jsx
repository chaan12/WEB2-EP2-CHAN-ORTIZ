import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getMealById } from "../services/recipeService";
import "../styles/pages/RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: meal, loading, error } = useFetch(() => getMealById(id), [id]);

  const [ingredients, setIngredients] = useState([]);
  const storageKey = `removed_${id}`;
  const [removedIngredients, setRemovedIngredients] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAll, setShowAll] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (meal) {
      const list = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing) list.push(`${measure} ${ing}`);
      }
      const saved = localStorage.getItem(storageKey);
      const removed = saved ? JSON.parse(saved) : [];
      setRemovedIngredients(removed);
      setIngredients(list.filter((item) => !removed.includes(item)));
    }
  }, [meal, storageKey]);

  const removeIngredient = (ingToRemove) => {
    const newRemoved = [...removedIngredients, ingToRemove];
    setRemovedIngredients(newRemoved);
    localStorage.setItem(storageKey, JSON.stringify(newRemoved));
    setIngredients((prev) => prev.filter((item) => item !== ingToRemove));
    setShowAll(false);
  };

  const addIngredient = (ingToAdd) => {
    const newRemoved = removedIngredients.filter((item) => item !== ingToAdd);
    setRemovedIngredients(newRemoved);
    localStorage.setItem(storageKey, JSON.stringify(newRemoved));
    setIngredients((prev) => [...prev, ingToAdd]);
  };

  if (loading) return <p className="center">Cargando receta…</p>;
  if (error) return <p className="center">Error: {error.message}</p>;

  const displayedIngredients =
    isMobile && !showAll ? ingredients.slice(0, 3) : ingredients;

  return (
    <div className="recipe-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <header className="recipe-header">
        <h1 className="recipe-title">{meal.strMeal}</h1>
        <div className="recipe-info">
          <span>
            <strong>ID:</strong> {meal.idMeal}
          </span>
          <span>
            <strong>Categoría:</strong> {meal.strCategory}
          </span>
        </div>
      </header>

      <div className="recipe-main">
        <div className="recipe-image">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
        </div>

        <section className="ingredients-section">
          <div className="ingredients-header">
            <h2>Ingredientes</h2>
            <button
              className="btn-show-removed"
              onClick={() => setShowRemoved((prev) => !prev)}
            >
              {showRemoved ? "Ocultar eliminados" : "Mostrar eliminados"}
            </button>
          </div>
          <ul className="ingredients-list">
            {displayedIngredients.map((ing, idx) => (
              <li key={idx}>
                {ing}
                <button onClick={() => removeIngredient(ing)}>Eliminar</button>
              </li>
            ))}
          </ul>
          {isMobile && !showAll && ingredients.length > 3 && (
            <button className="btn-show-more" onClick={() => setShowAll(true)}>
              Ver más
            </button>
          )}
          {isMobile && showAll && ingredients.length > 3 && (
            <button className="btn-show-more" onClick={() => setShowAll(false)}>
              Ver menos
            </button>
          )}
          {showRemoved && removedIngredients.length > 0 && (
            <ul className="removed-list">
              {removedIngredients.map((ing, idx) => (
                <li key={idx}>
                  {ing}
                  <button
                    onClick={() => addIngredient(ing)}
                    className="btn-add"
                  >
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="instructions-section full-width">
        <h2>Instrucciones</h2>
        <ol>
          {meal.strInstructions
            .split(". ")
            .map((step, i) =>
              step.trim() ? <li key={i}>{step.trim()}.</li> : null
            )}
        </ol>
      </section>

      {meal.strYoutube && (
        <section className="video-preview">
          <iframe
            width="100%"
            height="400"
            src={meal.strYoutube.replace("watch?v=", "embed/")}
            title="Video del platillo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </section>
      )}

      <footer className="recipe-footer">
        {meal.strYoutube && (
          <a
            href={meal.strYoutube}
            className="btn-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canal de YouTube
          </a>
        )}
        {meal.strSource && (
          <a
            href={meal.strSource}
            className="btn-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Página Web
          </a>
        )}
      </footer>
    </div>
  );
}
