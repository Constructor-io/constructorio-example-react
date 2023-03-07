/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CioAutocomplete } from '@constructor-io/constructorio-ui-autocomplete';
import cioClient from '../../app/cioClient';

function AutocompleteSearch() {
  const navigate = useNavigate();

  const submitSearch = (e) => {
    const { query, item } = e;

    if (query) {
      navigate(`/search?q=${query}`);
    } else if (item?.value) {
      navigate(`/search?q=${item?.value}`);
    }
  };

  return (
    <CioAutocomplete
      cioJsClient={ cioClient }
      onSubmit={ submitSearch }
      placeholder="Search..."
    />
  );
}

export default AutocompleteSearch;
