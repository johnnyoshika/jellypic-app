import React from 'react';
import { useUser } from 'context/user-context';

const Dashboard = () => {
  const user = useUser();

  return <div>Hello {user.firstName}</div>;
};

export default Dashboard;
