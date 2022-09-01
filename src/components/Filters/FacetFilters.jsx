import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseUrlParameters } from '../../utils';

function FacetFilters(props) {
  const { facets } = props;
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { parameters: { filters } } = parseUrlParameters();
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const tmpChecked = {};

    Object.entries(filters).forEach(([filterGroup, filterOptions]) => {
      if (filterGroup !== 'group_id') {
        filterOptions.forEach((facetOption) => {
          tmpChecked[`${filterGroup}|${facetOption}`] = true;
        });
      }
    });
    setChecked(tmpChecked);
  }, [facets]);

  const onFacetOptionSelect = (event) => {
    const facetIdSplit = event?.target?.id?.split('|');

    if (facetIdSplit) {
      const [facetGroup, facetOption] = facetIdSplit;
      const filterKey = `filters[${facetGroup}]`;
      const existingValues = params.get(filterKey);
      let newValue;

      if (event?.target?.checked) {
        newValue = existingValues ? `${existingValues},${facetOption}` : facetOption;
      } else {
        params.delete(filterKey);
        newValue = existingValues.split(',').filter((val) => val !== facetOption).join(',');
      }

      if (newValue) {
        params.set(filterKey, newValue);
      }
      navigate({ search: params.toString() }, { replace: true });
    }
  };

  return (
    <ul className="overflow-hidden">
      {facets.filter((facet) => facet.type === 'multiple').map((facet) => (
        <li className="font-bold" key={ facet.name }>
          <div className="mb-1">
            {facet.display_name}
          </div>
          <ul className="mb-2 pb-2">
            {facet.options.slice(0, 6).map((option) => (
              <li className="font-normal ml-2" key={ option.display_name }>
                <input
                  type="checkbox"
                  id={ `${facet.name}|${option.value}` }
                  className="mr-2"
                  onChange={ onFacetOptionSelect }
                  checked={ checked[`${facet.name}|${option.value}`] || false }
                />
                <label htmlFor={ `${facet.name}|${option.value}` }>
                  { option.display_name }
                </label>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <li />
    </ul>
  );
}

export default FacetFilters;
