import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProducts, loadMoreProducts } from '../../utils';
import { loadStatuses } from '../../utils/constants';
import SearchHeader from './SearchHeader/SearchHeader';
import SearchContainer from './SearchContainer/SearchContainer';

function Search() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [loadStatus, setLoadStatus] = useState(loadStatuses.SUCCESS);
  const [loadMoreStatus, setLoadMoreStatus] = useState(loadStatuses.SUCCESS);
  const [items, setItems] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [facets, setFacets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchProductsFromAPI = async () => {
      setLoadStatus(loadStatuses.LOADING);

      try {
        const response = await fetchProducts();

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

    fetchProductsFromAPI();
  }, [location]);

  const loadMoreProductsAndSetState = async () => {
    setLoadMoreStatus(loadStatuses.LOADING);

    try {
      const response = await loadMoreProducts(page, totalResults);

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

  return (
    <div className="text-lg sm:text-base">
      <SearchHeader
        sortOptions={ sortOptions }
        loadStatus={ loadStatus }
        facets={ facets }
        groups={ groups }
      />
      <SearchContainer
        items={ items }
        loadStatus={ loadStatus }
        facets={ facets }
        groups={ groups }
        totalResults={ totalResults }
        error={ error }
        page={ page }
        loadMoreStatus={ loadMoreStatus }
        loadMoreProducts={ loadMoreProductsAndSetState }
      />
    </div>
  );
}

export default Search;
