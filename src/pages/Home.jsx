import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import useFetch from "../hooks/useFetch";
import { getCategories, getMealsByCategory } from "../services/recipeService";
import Pineapple from "../assets/Pineapple.svg";
import "../styles/pages/Home.css";
import chefIcon from "../assets/chef-icon.png";

export default function Home() {
  const {
    data: categories,
    loading: loadingCats,
    error: errorCats,
  } = useFetch(getCategories, []);
  const [activeCat, setActiveCat] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCategories = isMobile ? categories?.slice(0, 6) : categories;
  // const visibleCategories = categories;

  const {
    data: meals,
    loading: loadingMeals,
    error: errorMeals,
  } = useFetch(() => getMealsByCategory(activeCat), [activeCat]);

  useEffect(() => {
    if (categories?.length > 0) {
      setActiveCat(categories[0].strCategory);
    }
  }, [categories]);

  if (loadingCats) return <p className="center">Cargando categorías…</p>;
  if (errorCats) return <p className="center">Error al cargar categorías</p>;

  const filteredMeals = meals
    ?.filter((meal) =>
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a, b) =>
      sortOrder === "asc"
        ? a.strMeal.localeCompare(b.strMeal)
        : b.strMeal.localeCompare(a.strMeal)
    );

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-img">
          <img src={Pineapple} alt="Hero dish" />
        </div>
        <div className="hero-content">
          <div className="hero-brand">
            <img src={chefIcon} alt="Chef icon" />
            HomeChef
          </div>
          <h1>
            Chefs
            <br />
            <span>Academy</span>
            Secrets
          </h1>
          <div className="hero-notice">
            <span className="dot" />
            New recipe for you to try <br /> out, let’s cook!
          </div>
        </div>
      </header>

      <div className="content">
        <aside className="categories">
          <h2>Categories</h2>
          <div className="categories-list">
            {visibleCategories?.map((cat) => (
              <button
                key={cat.idCategory}
                className={`cat-btn ${
                  cat.strCategory === activeCat ? "active" : ""
                }`}
                onClick={() => setActiveCat(cat.strCategory)}
              >
                <img src={cat.strCategoryThumb} alt={cat.strCategory} />
                <span>{cat.strCategory}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="main">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search recipes and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isMobile && (
            <div className="sort-wrapper">
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="" disabled>
                  Sort by: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▾
                </option>
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          )}

          <div className="recipes-grid">
            {loadingMeals && <p className="center">Cargando recetas…</p>}
            {errorMeals && <p className="center">Error al cargar recetas</p>}
            {filteredMeals?.map((m) => (
              <RecipeCard key={m.idMeal} {...m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
