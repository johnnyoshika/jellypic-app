import React from 'react';

const Error = ({ error, children }) => {
  return (
    <div className="text-center mt-20 mb-20">
      <div className="error">{error.toString()}</div>
      {children && <div className="mt-20 mb-20">{children}</div>}
    </div>
  );
};

export default Error;
