import React, { } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SortOptions(props) {
  const { sortOptions } = props;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const selectedSort = `${params.get('sort_by')}_${params.get('sort_order')}`;

  const onChangeSorting = (event) => {
    const selectedItem = sortOptions.find(
      (item) => item.id === event.target.value,
    );

    params.set('sort_by', selectedItem.sort_by);
    params.set('sort_order', selectedItem.sort_order);

    navigate({ search: params.toString() });
  };

  if (sortOptions?.length > 0) {
    return (
      <select
        className="w-1/2 sm:w-auto cursor-pointer p-2 mr-0 sm:mr-2 border-2 rounded-lg outline-none"
        onChange={ onChangeSorting }
        value={ selectedSort }
      >
        {sortOptions.map((sortOption) => (
          <option key={ sortOption.id } value={ sortOption.id }>
            {sortOption.display_name}
          </option>
        ))}
      </select>
    );
  }
  return null;
}

export default SortOptions;
