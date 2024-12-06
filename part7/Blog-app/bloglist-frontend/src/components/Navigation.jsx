import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="navigation">
      <Link className="link" to={'/'}>
        Home
      </Link>
      <Link className="link" to={'/blogs'}>
        Blogs
      </Link>
      <Link className="link" to={'/users'}>
        Users
      </Link>
    </div>
  );
};

export default Navigation;
