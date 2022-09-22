/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { loadStatuses } from '../utils/constants';
import ProductCard from './ProductCard';

function Results(props) {
  const {
    items,
    loadMoreStatus,
    totalResults,
    page,
    loadMoreSearchResults,
    dataAttributes,
  } = props;
  const numResultsPerPage = 21;
  const location = useLocation();

  return (
    <div className="flex flex-col grow mt-8">
      <div
        id="search-results"
        className="mb-4 flex flex-col sm:flex-row flex-wrap sm:grid sm:grid-cols-[repeat(2,225px)]
                lg:grid-cols-[repeat(4,225px)] auto-rows-max gap-y-6 place-content-center
                items-center md:items-start justify-around md:justify-between"
        data-cnstrc-num-results={ totalResults }
        { ...dataAttributes }
      >
        { items.map((item) => <ProductCard key={ item.data.id } product={ item } />) }
      </div>
      {(page * numResultsPerPage < totalResults) && location.pathname.includes('search') && (
        <button className="w-80 mx-auto px-4 py-2 border rounded flex justify-center" type="button" onClick={ () => loadMoreSearchResults() }>
          {loadMoreStatus === loadStatuses.LOADING
            ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : `Load More Results ∙ ${(page * numResultsPerPage).toLocaleString()} / ${totalResults.toLocaleString()}` }
        </button>
      )}
    </div>
  );
}

export default Results;
