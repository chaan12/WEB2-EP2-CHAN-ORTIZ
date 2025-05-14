export async function getCategories() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  if (!res.ok) throw new Error('No se pudieron cargar las categorías');
  const data = await res.json();
  return data.categories;
}

export async function getMealsByCategory(category) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
  );
  if (!res.ok) throw new Error('No se pudieron cargar las recetas');
  const data = await res.json();
  return data.meals;
}

export async function getMealById(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (!res.ok) throw new Error('No se pudo cargar la receta');
  const data = await res.json();
  return data.meals[0];
}