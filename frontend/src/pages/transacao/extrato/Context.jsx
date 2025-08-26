import { createContext, useContext } from 'react';

export const ExtratoContext = createContext(null);

export function useExtratoContext() {
  return useContext(ExtratoContext);
}