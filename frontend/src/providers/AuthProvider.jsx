import { useContext, createContext, useState } from 'react';

const AuthContext = createContext();
const STORAGE_USER_KEY = 'user';

const parseUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_USER_KEY);

    if (user) {
      return JSON.parse(user);
    }

    return null;
  } catch {
    return null;
  }
}

export default function AuthProvider(props) {
  const [user, setUser] = useState(parseUser);

  const login = (values) => {
    setUser(values);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(values));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  const getUser = () => {
    const user = parseUser();

    return user || null;
  }

  const isAuthenticated = () => {
    const user = parseUser();

    return !!(user && user.id);
  }

  const contextValue = {
    user,
    login,
    logout,
    getUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider {...props}
      value={contextValue} />
  );
}

export function useAuth() {
  return useContext(AuthContext);
}