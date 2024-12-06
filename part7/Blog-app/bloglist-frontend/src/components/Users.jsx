import React from 'react';
import './Users.css';

const Users = ({ users }) => {
  return (
    <div className="container">
      <h1 className="heading">Users</h1>
      <h2 className="subHeading">Blogs by Other Users</h2>
      {users.length > 0 ? (
        <ul className="userList">
          {users.map((user) => (
            <li key={user.id} className="userItem">
              <span>{user.username}</span>
              <span>{user.blogs.length} Blogs</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="noUsers">No users available</div>
      )}
    </div>
  );
};

export default Users;
