import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function GroupFilters(props) {
  const { groups } = props;
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const onGroupClick = (id) => {
    params.set('group_id', id);
    navigate({ search: params.toString() });
  };

  return (
    <div className="mb-2">
      <strong className="mb-1">
        Categories
      </strong>
      <ul className="p-2 overflow-hidden">
        {groups.map((group) => (
          <div key={ group.group_id }>
            {group.parents.length > 0 && (
              <div className="mb-1">
                {group.parents.map((parent, parentIndex) => (
                  <button
                    className="underline cursor-pointer"
                    onClick={ () => onGroupClick(parent.group_id) }
                    key={ parent.group_id }
                    type="button"
                  >
                    {parent.display_name}
                    { parentIndex !== group.parents.length - 1 && (' / ')}
                  </button>
                ))}
                {' '}
                /
                {' '}
                {group.display_name}
              </div>
            )}
            <li key={ group.group_id }>
              <ul className="ml-2">
                {group.children.map((child) => (
                  <li
                    className="block cursor-pointer"
                    key={ child.group_id }
                  >
                    <button className="cursor-pointer text-left" onClick={ () => onGroupClick(child.group_id) } type="button">{child.display_name}</button>
                  </li>
                ))}
              </ul>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default GroupFilters;
