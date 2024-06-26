/* eslint-disable import/prefer-default-export */
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import cioClient from '../app/cioClient';

export function parseUrlParameters() {
  let urlSearchParams;
  const { search } = window.location;
  const decodedURI = decodeURIComponent(search);

  // Custom functionality - allows usage of cnstrc request urls in the search bar
  if (decodedURI.match(/cnstrc.com\/search\//)) {
    const reformattedUrl = decodedURI.replace(/\?q=.+search\/(.+)\?/, '?q=$1&');

    urlSearchParams = new URLSearchParams(reformattedUrl);
  } else if (decodedURI.match(/cnstrc.com\/browse\//)) {
    const reformattedUrl = decodedURI.replace(/\?q=.+browse\/([^/]+)\/([^/]+)\?/, '?filterName=$1&filterValue=$2&');

    urlSearchParams = new URLSearchParams(reformattedUrl);
  } else {
    // Standard functionality
    urlSearchParams = new URLSearchParams(search);
  }

  const searchResultsParameters = {
    parameters: {
      filters: {},
      sortBy: null,
      sortOrder: null,
    },
  };

  // eslint-disable-next-line
  for (const [key, value] of urlSearchParams) {
    // Custom functionality - allows usage of cnstrc request urls in the search bar
    if (key === 'i') {
      searchResultsParameters.i = value;
    }
    if (key === 's') {
      searchResultsParameters.s = value;
    }
    if (key === 'ui') {
      searchResultsParameters.ui = value;
    }
    if (key === 'filterName') {
      searchResultsParameters.filterName = value;
    }
    if (key === 'filterValue') {
      searchResultsParameters.filterValue = value;
    }
    if (key === 'key') {
      searchResultsParameters.key = value;
    }

    // Standard functionality
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
    const filterMatch = key.match(/filters\[(.*?)\]/);

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

export const fetchSearchResults = async () => {
  const {
    query,
    parameters,
    key,
    filterName,
    filterValue,
    i,
    s,
    ui,
  } = parseUrlParameters();
  let response;

  // Custom functionality - allows usage of cnstrc request urls in the search bar
  if (key) {
    const newCioClient = new ConstructorIOClient({
      apiKey: key,
      clientId: i,
      sessionId: s,
      userId: ui,
    });

    if (filterName && filterValue) {
      response = await newCioClient.browse.getBrowseResults(filterName, filterValue, parameters);
    } else {
      response = await newCioClient.search.getSearchResults(query, parameters);
    }
  } else {
    // Standard functionality
    response = await cioClient.search.getSearchResults(query, parameters);
  }

  return response.response;
};

export const fetchAutoCompleteResults = (query) => (
  cioClient.autocomplete.getAutocompleteResults(query, {
    resultsPerSection: {
      Products: 6,
      'Search Suggestions': 10,
    },
  })
);

export const loadMoreSearchResults = async (currentPage, totalResults) => {
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

export const fetchBrowseReults = async (filterName, filterValue) => {
  const { parameters } = parseUrlParameters();
  const response = await cioClient.browse.getBrowseResults(filterName, filterValue, parameters);

  return response.response;
};

export const fetchRecommendations = async (podId) => {
  // To avoid zero results, we apply a filter to enable backfilling via "filtered_items" strategy
  const response = await cioClient.recommendations.getRecommendations(podId, { numResults: 6, filters: { group_id: 'AP01' } });

  return response;
};
