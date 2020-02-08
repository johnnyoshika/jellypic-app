import React, { useContext, useState } from 'react';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error('useUser must be used within a UserProvider');

  return context;
};

const useUser = () => useUserContext().user;
const useSetUser = () => useUserContext().setUser;

export { UserProvider, useUser, useSetUser };
