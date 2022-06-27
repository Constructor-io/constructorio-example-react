import React from 'react';
import ProductCard from './ProductCard';
import GroupFilters from '../../../Filters/GroupFilters';
import FacetFilters from '../../../Filters/FacetFilters';
import { loadStatuses } from '../../../../utils/constants';

function SearchResults(props) {
  const {
    items,
    loadMoreStatus,
    totalResults,
    page,
    loadMoreProducts,
    groups,
    facets,
  } = props;
  const numResultsPerPage = 20;

  return (
    <div className="flex pb-10">
      <div id="search-filters" className="w-[200px] mr-5">
        <GroupFilters groups={ groups } />
        <FacetFilters facets={ facets } />
      </div>
      <div className="flex flex-col grow">
        <div
          id="search-results"
          className="mb-4 grid grid-cols-[repeat(3,225px)] lg:grid-cols-[repeat(4,225px)] gap-y-6 place-content-start justify-between"
          data-cnstrc-search
          data-cnstrc-num-results={ totalResults }
        >
          { items.map((item) => <ProductCard key={ item.data.id } product={ item } />) }
        </div>
        {page * numResultsPerPage < totalResults && (
          <button className="w-80 mx-auto px-4 py-2 border rounded flex justify-center" type="button" onClick={ () => loadMoreProducts() }>
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
    </div>
  );
}

export default SearchResults;
