type Favorites = {
  [userId: string]: string[];
};

const FAVORITES_KEY = 'jetAppFavorites';

const getFavorites = (): Favorites => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveFavorites = (favorites: Favorites): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const getUserFavorites = (userId: string): string[] => {
  const favorites = getFavorites();
  return favorites[userId] || [];
};

export const addFavorite = (userId: string, restaurantId: string): void => {
  const favorites = getFavorites();
  const userFavorites = favorites[userId] || [];
  if (!userFavorites.includes(restaurantId)) {
    favorites[userId] = [...userFavorites, restaurantId];
    saveFavorites(favorites);
  }
};

export const removeFavorite = (userId: string, restaurantId: string): void => {
  const favorites = getFavorites();
  const userFavorites = favorites[userId] || [];
  if (userFavorites.includes(restaurantId)) {
    favorites[userId] = userFavorites.filter(id => id !== restaurantId);
    saveFavorites(favorites);
  }
};

export const isRestaurantFavorite = (userId: string, restaurantId: string): boolean => {
  const userFavorites = getUserFavorites(userId);
  return userFavorites.includes(restaurantId);
};
