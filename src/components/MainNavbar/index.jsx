/* eslint-disable max-len */
import * as React from 'react';
import { NavLink } from 'react-router-dom';

function MainNavbar(props) {
  const { browseGroups } = props;

  const [menuToggle, setMenuToggle] = React.useState(false);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-0 py-2.5 rounded mb-5 mt-5">
      <div className="flex flex-wrap justify-between items-center w-full">
        <button onClick={ () => setMenuToggle((state) => !state) } data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </button>
        <div
          className={ `${menuToggle === true ? 'hidden' : ''} w-full md:block justify-center border-b mb-5` }
          id="navbar-default"
        >
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white justify-between">
            {browseGroups.map((group) => (
              <li key={ group.group_id }>
                <NavLink
                  to={ `/browse/${group.display_name}` }
                  style={ ({ isActive }) => (isActive ? { color: 'darkBlue' } : {}) }
                  state={ group }
                  className="block py-2 pr-4 pl-3 sm:p-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                >
                  {group.display_name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
