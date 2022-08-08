import React from 'react';
import SearchResults from './SearchResults/SearchResults';
import { loadStatuses } from '../../../utils/constants';

function SearchContainer(props) {
  const {
    items,
    loadStatus,
    facets,
    groups,
    totalResults,
    page,
    loadMoreStatus,
    loadMoreProducts,
  } = props;
  const isLoading = loadStatus === loadStatuses.LOADING;
  const numItems = items.length;

  return (
    <div>
      {isLoading && (
        <center>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </center>
      )}
      {
        !isLoading && (loadStatus === loadStatuses.SUCCESS && numItems >= 1)
          && (
            <SearchResults
              items={ items }
              loadStatus={ loadStatus }
              facets={ facets }
              groups={ groups }
              totalResults={ totalResults }
              page={ page }
              loadMoreStatus={ loadMoreStatus }
              loadMoreProducts={ loadMoreProducts }
            />
          )
      }
      {!isLoading && (loadStatus === loadStatuses.FAILED || numItems === 0) && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="font-bold">No results found</p>
          <p className="text-sm">Try entering a query in the search box above</p>
        </div>
      )}
    </div>
  );
}

export default SearchContainer;
