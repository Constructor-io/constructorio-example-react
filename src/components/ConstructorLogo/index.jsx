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
        src="https://constructor.com/hubfs/Website%20-%202024/Logos/Logo-black.svg"
        alt=""
      />
    </Link>
  );
}
export default ConstructorLogo;
