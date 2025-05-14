import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/RecipeCard.css';

export default function RecipeCard({ idMeal, strMeal, strMealThumb }) {
  const navigate = useNavigate();
  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recipe/${idMeal}`)}
      style={{ cursor: 'pointer' }}
    >
      <img src={strMealThumb} alt={strMeal} />
      <h3>{strMeal}</h3>
    </div>
  );
}