import React from 'react';

const Error = ({ error, children }) => {
  return (
    <div className="text-center">
      <div className="error">{error.toString()}</div>
      <div>{children}</div>
    </div>
  );
};

export default Error;
