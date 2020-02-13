import React, { useContext, useState } from 'react';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [me, setMe] = useState(null);

  return (
    <UserContext.Provider value={{ me, setMe }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error('useMe must be used within a UserProvider');

  return context;
};

const useMe = () => useUserContext().me;
const useSetMe = () => useUserContext().setMe;

export { UserProvider, useMe, useSetMe };
