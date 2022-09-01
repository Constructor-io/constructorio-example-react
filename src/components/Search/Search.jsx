import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiltersContext } from '../../Layout';
import { fetchSearchResults, loadMoreSearchResults } from '../../utils';
import { loadStatuses } from '../../utils/constants';
import Loader from '../Loader';
import Results from '../Results';

function Search() {
  const { setFacets, setGroups, setSortOptions } = useContext(FiltersContext);
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [loadStatus, setLoadStatus] = useState(loadStatuses.SUCCESS);
  const [loadMoreStatus, setLoadMoreStatus] = useState(loadStatuses.SUCCESS);
  const [items, setItems] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchSearchResultsFromAPI = async () => {
      setLoadStatus(loadStatuses.LOADING);

      try {
        const response = await fetchSearchResults();

        setLoadStatus(loadStatuses.LOADING);
        setItems(response.results);
        setSortOptions(response.sort_options.map((item) => ({ ...item, id: `${item.sort_by}_${item.sort_order}` })));
        setFacets(response.facets);
        setGroups(response.groups);
        setTotalResults(response.total_num_results);
        setLoadStatus(loadStatuses.SUCCESS);
      } catch (e) {
        setLoadStatus(loadStatuses.FAILED);
        setError(e);
      }
    };

    fetchSearchResultsFromAPI();
  }, [location]);

  const loadMoreSearchResultsAndSetState = async () => {
    setLoadMoreStatus(loadStatuses.LOADING);

    try {
      const response = await loadMoreSearchResults(page, totalResults);

      if (response) {
        setItems([...items, ...response.results]);
        setSortOptions(response.sort_options.map((item) => ({ ...item, id: `${item.sort_by}_${item.sort_order}` })));
        setFacets(response.facets);
        setGroups(response.groups);
        setTotalResults(response.total_num_results);
        setPage(page + 1);
        setLoadMoreStatus(loadStatuses.SUCCESS);
      }
    } catch (e) {
      setLoadMoreStatus(loadStatuses.FAILED);
      setError(e);
    }
  };

  const isLoading = loadStatus === loadStatuses.LOADING;
  const numItems = items.length;

  return (
    <>
      {isLoading && (
        <Loader />
      )}
      {
        !isLoading && (loadStatus === loadStatuses.SUCCESS && numItems >= 1)
          && (
          <Results
            items={ items }
            totalResults={ totalResults }
            page={ page }
            loadMoreStatus={ loadMoreStatus }
            loadMoreSearchResults={ loadMoreSearchResultsAndSetState }
            dataAttributes={ { 'data-cnstrc-search': true } }
            error={ error }
          />
          )
      }
      {!isLoading && (loadStatus === loadStatuses.FAILED || numItems === 0) && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 w-full" role="alert">
          <p className="font-bold">No results found</p>
          <p className="text-sm">Try entering a query in the search box above</p>
        </div>
      )}
    </>
  );
}

export default Search;
