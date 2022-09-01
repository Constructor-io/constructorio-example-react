/* eslint-disable react/jsx-props-no-spreading */
import { useCombobox } from 'downshift';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAutoCompleteResults } from '../../utils';
import { loadStatuses } from '../../utils/constants';

function AutocompleteSearch() {
  const [params] = useSearchParams();
  const query = params.get('q');
  const [searchTerm, setSearchTerm] = useState(query || '');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [, setLoadStatus] = useState(loadStatuses.SUCCESS);

  const itemToString = (item) => (item ? item.name : '');

  const {
    isOpen,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items: [...searchSuggestions, ...products],
    itemToString,
    onInputValueChange: async ({ inputValue }) => {
      setSearchTerm(inputValue);
    },
    onSelectedItemChange({ selectedItem }) {
      setSearchTerm(selectedItem.value);
      navigate(`?q=${selectedItem.value}`);
    },
  });

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  let timeout;
  useEffect(() => {
    if (!searchTerm) {
      setProducts([]);
      setSearchSuggestions([]);
    } else {
      (async () => {
        timeout = setTimeout(async () => {
          try {
            setLoadStatus(loadStatuses.LOADING);
            const res = await fetchAutoCompleteResults(searchTerm);
            if (res.sections.Products?.length) {
              setProducts(res.sections.Products);
            }
            if (res.sections['Search Suggestions']?.length) {
              setSearchSuggestions(res.sections['Search Suggestions']);
            }
          } catch (error) {
            setLoadStatus(loadStatuses.FAILED);
          }
          setLoadStatus(loadStatuses.SUCCESS);
        }, 300);
      })();
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchTerm]);

  return (
    <form
      id="search-form"
      onSubmit={ submitSearch }
    >

      <div className="relative">
        <div { ...getComboboxProps() }>
          <input
            { ...getInputProps() }
            value={ searchTerm }
            className="bg-gray-200 w-full sm:w-80 border-2 border-gray-200 rounded py-2 px-4 text-gray-700
          leading-tight focus:outline-none focus:bg-white focus:border-blue-800 mb-2 sm:mb-0"
            id="search-input"
            placeholder="Search..."
            data-cnstrc-search-input
          />
        </div>
        <div data-cnstrc-autosuggest>
          <ul
            { ...getMenuProps() }
            className="shadow-lg absolute p-4 list-none z-50 bg-white w-[800px] inset-x-0 sm:-left-1/2 sm:translate-x-[-10%] flex gap-4 sm:gap-2 border"
            style={ !isOpen || !searchTerm ? { visibility: 'hidden' } : { } }
          >

            {isOpen && (
            <div className="basis-1/3">
              {searchSuggestions.map((item, index) => (
                <li
                  data-cnstrc-item-section="Search Suggestions"
                  data-cnstrc-item-name={ item.value }
                  data-cnstrc-item-id={ item.data?.id }
                  className="mb-1 cursor-pointer hover:underline"
                  key={ `${item.value} ${item.data?.id} ` }
                  { ...getItemProps({ item, index }) }
                >
                  {item.value}
                </li>
              ))}
            </div>
            )}

            {isOpen && (
            <div className="basis-2/3 grid gap-4 grid-cols-3">
              {products.map((item, index) => (
                <li
                  data-cnstrc-item-section="Products"
                  data-cnstrc-item-name={ item.value }
                  data-cnstrc-item-id={ item.data?.id }
                  className="basis-1/3 flex flex-col content-center space-x-2"
                  key={ `${item.value} ${item.data?.id} ` }
                  { ...getItemProps({ item, index: (index + searchSuggestions.length) }) }
                >
                  <div className="hover:underline">
                    <img width="200" src={ item.data?.image_url } alt="" />
                    <div className="text-sm">
                      {item.value}
                    </div>
                  </div>
                </li>
              ))}
            </div>
            )}
          </ul>
        </div>
      </div>
    </form>
  );
}

export default AutocompleteSearch;
