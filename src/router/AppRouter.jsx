import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RecipeDetail from '../pages/RecipeDetail';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
    </Routes>
  );
}
