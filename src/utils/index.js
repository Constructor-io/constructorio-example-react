/* eslint-disable import/prefer-default-export */
import cioClient from '../app/cioClient';

export function parseUrlParameters() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const searchResultsParameters = {
    parameters: {
      filters: {},
      sortBy: null,
      sortOrder: null,
    },
  };

  // eslint-disable-next-line
  for (const [key, value] of urlSearchParams) {
    // key is a query
    if (key === 'q') {
      searchResultsParameters.query = value;
    }
    if (key === 'sort_by') {
      searchResultsParameters.parameters.sortBy = value;
    }
    if (key === 'sort_order') {
      searchResultsParameters.parameters.sortOrder = value;
    }
    // key is a filter
    const filterMatch = key.match(/filters\[(\w+)\]/);

    if (filterMatch?.length) {
      searchResultsParameters.parameters.filters[filterMatch?.[1]] = value.split(',');
    }
    // key is category
    if (key === 'group_id') {
      searchResultsParameters.parameters.filters.group_id = value;
    }
  }

  return searchResultsParameters;
}

export const fetchProducts = async () => {
  const { query, parameters } = parseUrlParameters();
  const response = await cioClient.search.getSearchResults(query, parameters);

  return response.response;
};

export const fetchAutoCompleteResults = (query) => (
  cioClient.autocomplete.getAutocompleteResults(query, {
    resultsPerSection: {
      Products: 5,
      'Search Suggestions': 10,
    },
  })
);

export const loadMoreProducts = async (currentPage, totalResults) => {
  if (20 * currentPage >= totalResults) {
    return false;
  }

  const { query, parameters } = parseUrlParameters();
  const response = await cioClient.search.getSearchResults(
    query,
    { ...parameters, page: currentPage + 1 },
  );

  return response.response;
};
