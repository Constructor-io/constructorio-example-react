import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Search from './components/Search/Search';
import Browse from './components/Browse';
import CnstrcHighlighter from './components/CnstrcHighlighter';

import Layout from './Layout';

function App() {
  return (
    <div className="App p-5 max-w-lg sm:max-w-7xl mx-auto">
      <CnstrcHighlighter />
      <Routes>
        <Route
          path="*"
          element={ <Layout /> }
        >
          <Route
            path="search"
            element={ <Search /> }
          />
          <Route
            path="browse"
            element={ <Browse /> }
          >
            <Route
              path=":groupId"
              element={ <Browse /> }
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
