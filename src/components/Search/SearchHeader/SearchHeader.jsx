/* eslint-disable max-len */
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStatuses } from '../../../utils/constants';
import GroupFilters from '../../Filters/GroupFilters';
import FacetFilters from '../../Filters/FacetFilters';

function SearchHeader(props) {
  const {
    sortOptions, loadStatus, groups, facets,
  } = props;
  const [params] = useSearchParams();
  const query = params.get('q');
  const selectedSort = `${params.get('sort_by')}_${params.get('sort_order')}`;
  const [searchTerm, setSearchTerm] = useState(query || '');
  const navigate = useNavigate();
  const [buttonToggle, setButtonToggle] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();

    navigate(`?q=${searchTerm}`);
  };

  const onChangeSorting = (event) => {
    const selectedItem = sortOptions.find(
      (item) => item.id === event.target.value,
    );

    params.set('sort_by', selectedItem.sort_by);
    params.set('sort_order', selectedItem.sort_order);

    navigate({ search: params.toString() });
  };

  return (
    <form id="search-form" onSubmit={ submitSearch } className="flex flex-col sm:flex-row justify-between mb-5 sm:ml-auto sm:mr-auto">
      <a href={ process.env.PUBLIC_URL } rel="nofollow" className="mb-2 sm:mb-0 ml-auto sm:ml-0 mr-auto sm:mr-0">
        <img width="180" height="40" src="https://constructor.io/wp-content/uploads/2018/11/group-1.svg" alt="" />
      </a>
      { loadStatus !== loadStatuses.LOADING && (
        <input
          className="bg-gray-200 w-full sm:w-80 border-2 border-gray-200 rounded py-2 px-4 text-gray-700
            leading-tight focus:outline-none focus:bg-white focus:border-blue-800 mb-2 sm:mb-0"
          id="search-input"
          value={ searchTerm }
          placeholder="Search..."
          onChange={ (e) => setSearchTerm(e.target.value) }
          data-cnstrc-search-input
        />
      ) }

      <div className="flex sm:block mx-auto sm:mx-0">
        <div>
          {groups.length && facets.length && (
          <div id="search-filters" className="sm:hidden sm:mr-40 text-lg m-2 p-2 border-2 rounded-lg">
            <button type="button" className="text-bold flex items-center" onClick={ () => setButtonToggle((state) => !state) }>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span className="mx-2">Filter</span>
            </button>
              {buttonToggle
                && (
                <div className="bg-white border-t-2 border-b-2 z-10 p-4 absolute w-full h-full top-0 left-0">
                  <button type="button" className="text-bold flex items-center absolute right-0 mr-4" onClick={ () => setButtonToggle((state) => !state) }>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={ 2 }
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <GroupFilters groups={ groups } />
                  <FacetFilters facets={ facets } />
                </div>
                )}
          </div>
          )}
        </div>

        <div className="m-2 p-2 border-2 rounded-lg">
          {sortOptions?.length > 0 && (
          <select onChange={ onChangeSorting } value={ selectedSort }>
            {sortOptions.map((sortOption) => (
              <option key={ sortOption.id } value={ sortOption.id }>
                {sortOption.display_name}
              </option>
            ))}
          </select>
          )}
        </div>

      </div>

    </form>
  );
}

export default SearchHeader;
