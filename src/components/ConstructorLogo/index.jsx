import React from 'react';
import { Link } from 'react-router-dom';

function ConstructorLogo() {
  return (
    <Link
      to="/browse"
      rel="nofollow"
      className="flex justify-center items-center mb-2 sm:mb-0 md:ml-0 md:mr-0 ml-2 mr-2"
    >
      <img
        width="180"
        height="40"
        src="https://constructor.io/wp-content/uploads/2018/11/group-1.svg"
        alt=""
      />
    </Link>
  );
}
export default ConstructorLogo;
