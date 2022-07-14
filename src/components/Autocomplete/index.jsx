/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */

import { useCombobox } from 'downshift';
import React, { useEffect, useState } from 'react';
import { fetchAutoCompleteResults } from '../../utils';
import { loadStatuses } from '../../utils/constants';

function AutocompleteSearch(props) {
  const { searchTerm, setSearchTerm } = props;
  const [status, setStatus] = useState();

  const [products, setProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const itemToString = (item) => (item ? item.name : '');

  const {
    isOpen,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items: [...products, ...searchSuggestions],
    itemToString,
    onInputValueChange: async ({ inputValue }) => {
      setSearchTerm(inputValue);
    },
    onSelectedItemChange({ selectedItem }) {
      setSearchTerm(selectedItem.value);
    },
  });

  let timeout;
  useEffect(() => {
    if (!searchTerm) {
      setProducts([]);
      setSearchSuggestions([]);
      setStatus();
    } else {
      (async () => {
        setStatus(loadStatuses.LOADING);
        timeout = setTimeout(async () => {
          try {
            const res = await fetchAutoCompleteResults(searchTerm);
            setStatus(loadStatuses.SUCCESS);
            setProducts(res.sections.Products);
            setSearchSuggestions(res.sections['Search Suggestions']);
          } catch (error) {
            setStatus(loadStatuses.FAILED);
          }
        }, 300);
      })();
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchTerm]);

  return (
    <div className="relative">
      <div { ...getComboboxProps() }>
        <input
          { ...getInputProps() }
          value={ searchTerm }
          className="bg-gray-200 w-80 border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-800"
          id="search-input"
          placeholder="Search..."
          data-cnstrc-search-input
        />
      </div>
      {isOpen && !!(products.length || searchSuggestions.length) && (
      <ul
        { ...getMenuProps() }
        className="shadow-lg absolute p-4 list-none z-50 bg-white w-[800px] inset-x-0 sm:-left-1/2 sm:translate-x-[-10%] flex gap-4 sm:gap-2"
      >
        {status === loadStatuses.LOADING ? (
          <li>...Loading</li>
        ) : (
          <>
            {!!searchSuggestions.length && (
            <div className="basis-1/3">
              {searchSuggestions.map((item, index) => (
                <li
                  className="mb-1"
                  key={ `${item.value} ${item.data?.id} ` }
                  { ...getItemProps({ item, index }) }
                >
                  {item.value}
                </li>
              ))}
            </div>
            )}

            <div className="basis-2/3 grid gap-4 grid-cols-3">
              {products.map((item, index) => (
                <li
                  className="basis-1/3 flex flex-col content-center space-x-2"
                  key={ `${item.value} ${item.data?.id} ` }
                  { ...getItemProps({ item, index }) }
                >
                  <a href="'" className="hover:underline">
                    <img width="200" src={ item.data?.image_url } alt="" />
                    <div className="text-sm">
                      {item.value}
                    </div>
                  </a>
                </li>
              ))}
            </div>
          </>
        )}
      </ul>
      )}
    </div>
  );
}

export default AutocompleteSearch;
