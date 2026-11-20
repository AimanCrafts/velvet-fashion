import { useContext } from 'react';
import { StoreContext } from './StoreContext';

/**
 * Hook to access the StoreContext throughout the app.
 * Throws an error if used outside of a StoreProvider.
 */
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
