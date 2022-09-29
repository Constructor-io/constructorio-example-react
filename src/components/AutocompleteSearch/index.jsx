/* eslint-disable react/jsx-props-no-spreading */
import { useCombobox } from 'downshift';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAutoCompleteResults } from '../../utils';
import { loadStatuses } from '../../utils/constants';

function AutocompleteSearch() {
  const [params] = useSearchParams();
  const location = useLocation();
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
    toggleMenu,
  } = useCombobox({
    items: [...searchSuggestions, ...products],
    itemToString,
    onInputValueChange: async ({ inputValue }) => {
      setSearchTerm(inputValue);
    },
    onSelectedItemChange({ selectedItem }) {
      // Item is product - do nothing
      if (selectedItem.data.id) {
        return;
      }

      setSearchTerm(selectedItem.value);
      navigate(`/search?q=${selectedItem.value}`);
    },
  });

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
    toggleMenu();
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

  useEffect(() => {
    if (location.pathname.includes('browse')) {
      setSearchTerm('');
    }
  }, [location]);

  return (
    <form
      id="search-form"
      onSubmit={ submitSearch }
      className="flex place-items-center"
    >

      <div className="relative w-full">
        <div { ...getComboboxProps() }>
          <input
            { ...getInputProps() }
            value={ searchTerm }
            className="bg-gray-200 w-full sm:w-96 border-2 border-gray-200 rounded-3xl px-4 text-gray-700
            leading-tight focus:outline-none focus:bg-white focus:border-blue-800 mb-0 mt-2 md:mt-0 p-3"
            id="search-input"
            placeholder="Search..."
            data-cnstrc-search-input
          />
        </div>
        <div data-cnstrc-autosuggest>
          <ul
            { ...getMenuProps() }
            className="shadow-lg absolute right-0 py-8 px-8 list-none z-50 bg-white w-full md:w-[600px] lg:w-[1000px] flex flex-col md:flex-row gap-4 sm:gap-2 border"
            style={ !isOpen || !searchTerm ? { display: 'none' } : { } }
          >
            {isOpen && (
            <div className="basis-1/3">
              <div className="text-lg font-bold mb-2">Search Suggestions</div>
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
              <div>
                <div className="text-lg font-bold mb-2">Products</div>
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
                      <div className="hover:underline flex flex-col items-center sm:items-start">
                        <img width="200" src={ item.data?.image_url } alt="" />
                        <div className="text-sm">
                          {item.value}
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </form>
  );
}

export default AutocompleteSearch;
