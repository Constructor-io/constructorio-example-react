import React, { useState } from 'react';
import GroupFilters from './GroupFilters';
import FacetFilters from './FacetFilters';

function FiltersMobile(props) {
  const { groups, facets } = props;
  const [filterButtonToggle, setFilterButtonToggle] = useState(false);

  const onFilterButtonToggle = () => {
    if (filterButtonToggle) {
      document.body.classList.remove('overflow-hidden');
      setFilterButtonToggle(false);
    } else {
      document.body.classList.add('overflow-hidden');
      setFilterButtonToggle(true);
    }
  };

  if ((groups.length || facets.length)) {
    return (
      <div
        id="search-filters"
        className="w-1/2 sm:hidden sm:mr-40 text-lg ml-0 sm:ml-2 border-2 rounded-lg"
      >
        <button
          type="button"
          className="p-2 w-full h-full text-bold flex items-center"
          onClick={ () => onFilterButtonToggle() }
        >
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
        {filterButtonToggle && (
          <div className="bg-white border-t-2 border-b-2 z-10 p-4 fixed w-full h-full top-0 left-0 overflow-y-auto">
            <button
              type="button"
              className="text-bold flex items-center absolute right-0 mr-4"
              onClick={ () => onFilterButtonToggle() }
            >
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
    );
  }

  return null;
}

export default FiltersMobile;
