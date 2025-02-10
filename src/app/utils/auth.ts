export const getAuthToken = (): string => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }
    return token;
  };
  