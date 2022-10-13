import * as React from 'react';

import { useEffect, useState } from 'react';
import Results from '../Results';

import { fetchRecommendations } from '../../utils';
import { loadStatuses } from '../../utils/constants';

function Recommendations() {
  const [loaded, setLoaded] = useState(loadStatuses.SUCCESS);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendationsFromAPI = async () => {
      setLoaded(loadStatuses.LOADING);
      try {
        const response = await fetchRecommendations('item_detail');

        setRecommendations(response?.results);
        setLoaded(loadStatuses.SUCCESS);
      } catch (e) {
        setLoaded(loadStatuses.FAILED);
      }
    };
    fetchRecommendationsFromAPI();
  }, []);

  return (
    <div>
      <h2>You may also like</h2>
      { loaded && <Results items={ recommendations } /> }
    </div>
  );
}

export default Recommendations;
