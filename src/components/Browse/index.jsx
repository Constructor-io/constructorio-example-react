import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiltersContext } from '../../Layout';
import { fetchBrowseReults } from '../../utils';
import { loadStatuses } from '../../utils/constants';
import Results from '../Results';

function Browse() {
  const {
    setFacets, setGroups, setSortOptions, rootBrowseGroupId,
  } = React.useContext(FiltersContext);

  const location = useLocation();
  const browseGroup = location.state;

  const [loadStatus, setLoadStatus] = useState(loadStatuses.STALE);
  const [items, setItems] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchSearchResultsFromAPI = async () => {
      setLoadStatus(loadStatuses.LOADING);

      try {
        // If browseGroup?.group_id undefined then filter value is root group
        const filterValue = browseGroup?.group_id || rootBrowseGroupId;
        const response = await fetchBrowseReults(
          'group_id',
          filterValue,
        );

        setLoadStatus(loadStatuses.LOADING);
        setItems(response?.results);
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
  }, [location, rootBrowseGroupId]);

  return (
    <Results
      items={ items }
      loadStatus={ loadStatus }
      totalResults={ totalResults }
      error={ error }
      dataAttributes={ { 'data-cnstrc-browse': true } }
    />
  );
}

export default Browse;
