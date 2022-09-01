import * as React from 'react';
import { createContext, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ConstructorLogo from './components/ConstructorLogo';
import AutocompleteSearch from './components/AutocompleteSearch';
import FiltersMobile from './components/Filters/FiltersMobile';
import SortOptions from './components/Filters/SortOptions';
import GroupFilters from './components/Filters/GroupFilters';
import FacetFilters from './components/Filters/FacetFilters';
import MainNavbar from './components/MainNavbar';
import cioClient from './app/cioClient';

// NOTE //
/*
  groups => groupsFilters which changes based on the current browse page
  browseGroups => browse navigation links which are fixed despite of the current browse page
*/

export const FiltersContext = createContext({});

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [facets, setFacets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [browseGroups, setBrowseGroups] = React.useState([]);
  const [rootBrowseGroupId, setRootBrowseGroupId] = React.useState([]);

  const filtersContextValues = React.useMemo(() => ({
    groups,
    setFacets,
    setGroups,
    setSortOptions,
    rootBrowseGroupId,
  }));

  React.useEffect(() => {
    (async () => {
      try {
        const res = await cioClient.browse.getBrowseGroups();
        setBrowseGroups(res?.response?.groups?.[0]?.children);
        setRootBrowseGroupId(res?.response?.groups?.[0]?.group_id);
        if (location.pathname === '/') {
          navigate('/browse');
        }
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  return (
    <div className="text-lg sm:text-base">
      <div className="flex flex-col sm:flex-row justify-between mb-2 sm:ml-auto sm:mr-auto">
        <ConstructorLogo />
        <AutocompleteSearch />
        <div className="flex sm:block mx-auto sm:mx-0 w-full sm:w-auto">
          <FiltersMobile groups={ groups } facets={ facets } />
          <SortOptions sortOptions={ sortOptions } />
        </div>
      </div>
      <MainNavbar browseGroups={ browseGroups } />
      <div className="flex pb-10">
        <div id="search-filters" className="w-[200px] hidden sm:block mr-5">
          { !!groups.length && <GroupFilters groups={ groups } /> }
          { !!facets.length && <FacetFilters facets={ facets } /> }
        </div>
        <FiltersContext.Provider value={ filtersContextValues }>
          <Outlet />
        </FiltersContext.Provider>
      </div>
    </div>
  );
}

export default Layout;
