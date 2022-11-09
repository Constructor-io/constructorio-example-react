import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../utils';
import { loadStatuses } from '../../utils/constants';
import RecommendationsResults from './RecommendationsResults';

function Recommendations() {
  const [loaded, setLoaded] = useState(loadStatuses.STALE);
  const [recommendations, setRecommendations] = useState([]);
  const [podData, setPodData] = useState();
  const [resultId, setResultId] = useState();
  const [numResults, setNumResults] = useState();

  useEffect(() => {
    const fetchRecommendationsFromAPI = async () => {
      setLoaded(loadStatuses.LOADING);
      try {
        const response = await fetchRecommendations('item_detail');

        setRecommendations(response?.response?.results);
        setNumResults(response?.response?.total_num_results);
        setResultId(response?.result_id);
        setPodData({
          podName: response?.response?.pod?.display_name,
          poId: response?.response?.pod?.id,
        });
        setLoaded(loadStatuses.SUCCESS);
      } catch (e) {
        setLoaded(loadStatuses.FAILED);
      }
    };
    fetchRecommendationsFromAPI();
  }, []);

  return (
    <div className="md:p-4">
      <div className="text-lg md:text-2xl mb-6 text-center">{podData?.podName}</div>
      { loaded === loadStatuses.SUCCESS && (
        <RecommendationsResults
          items={ recommendations }
          dataAttributes={ {
            dataCnstrcPodId: podData?.poId,
            dataCnstrcNumResults: numResults,
            dataCnstrcResultId: resultId,
          } }
        />
      )}
    </div>
  );
}

export default Recommendations;
