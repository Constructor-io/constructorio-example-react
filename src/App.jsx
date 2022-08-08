import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Search from './components/Search/Search';

function App() {
  const defaultSearchTerm = 'shoes';

  return (
    <div className="App p-5 max-w-lg sm:max-w-7xl mx-auto">
      <Routes>
        <Route
          path="/search"
          element={ <Search /> }
        />
        <Route
          path="*"
          element={ <Navigate to={ `/search?q=${defaultSearchTerm}` } replace /> }
        />
      </Routes>
    </div>
  );
}

export default App;
