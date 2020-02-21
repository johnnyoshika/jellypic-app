import React from 'react';
import Profile from './Profile';

import './style.css';

const User = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <div className="profile-container">
      <div className="gutter" />
      <div className="profile-main">
        <Profile id={id} />
      </div>
      <div className="gutter" />
    </div>
  );
};

export default User;
