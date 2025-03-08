// src/App.js
import React from 'react';
import EventBrowser from './EventBrowser';
import FilterBar from './FilterBar';
import { useState } from 'react';

function App() {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const handleCategoryChange = (category) => {
      setCategoryFilter(category);
  };
  return (
    <div className="App">
      <FilterBar onCategoryChange={handleCategoryChange}/>
      <EventBrowser categoryFilter={categoryFilter}/>
    </div>
  );
}

export default App;