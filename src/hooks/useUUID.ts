import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';


export const useUUID = () => {
  
  const generateUUID = useCallback((): string => {
    return uuidv4();
  }, []);

  return {
    generateUUID,
  };
};
