import * as React from 'react';
import { createContext, useState } from 'react';
import {
  Outlet, useLocation, useNavigate, useSearchParams,
} from 'react-router-dom';
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
  const [params] = useSearchParams();
  const query = params?.get('q');
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
      <div className="flex flex-col sm:flex-row justify-between sm:ml-auto sm:mr-auto mb-2 md:mb-5">
        <ConstructorLogo />
        <AutocompleteSearch />
      </div>
      <MainNavbar browseGroups={ browseGroups } />
      <div className="flex pb-10">
        <div id="search-filters" className="w-[200px] hidden sm:block mr-5">
          { !!groups.length && <GroupFilters groups={ groups } /> }
          { !!facets.length && <FacetFilters facets={ facets } /> }
        </div>
        <div className="items-center">
          <div className="flex flex-col sm:flex-row align-end justify-between items-center mb-6">
            <h1 className="text-3xl order-2 md:order-1">
              {query ? `Search results for “${query}”` : decodeURI(location.pathname.match(/[^/]+$/))}
            </h1>
            <div className="flex order-1 md:order-2 mb-4 md:mb-0 w-full md:w-auto gap-3">
              <SortOptions sortOptions={ sortOptions } />
              <FiltersMobile groups={ groups } facets={ facets } />
            </div>
          </div>
          <FiltersContext.Provider value={ filtersContextValues }>
            <Outlet />
          </FiltersContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default Layout;
