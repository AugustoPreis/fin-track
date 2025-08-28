import { createContext, useContext } from 'react';

export const AnaliseContext = createContext(null);

export function useAnaliseContext() {
  return useContext(AnaliseContext);
}