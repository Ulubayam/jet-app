import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { Header } from '../../components/Header/Header';
import { getUserFavorites } from '../../utils/favorites';
import { useAppSelector } from '../../redux/hooks';
import type { Restaurant } from 'redux/restaurant/types';
import { FavoriteRestaurantCard } from './components/FavoriteRestaurantCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import './Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const allRestaurants = useAppSelector((state) => state.restaurant.list);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const favoriteIds = getUserFavorites(user.uid);
      const favorites = allRestaurants.filter(restaurant => 
        favoriteIds.includes(restaurant.id)
      );
      setFavoriteRestaurants(favorites);
    } else {
      setFavoriteRestaurants([]);
    }
    
    setIsLoading(false);
  }, [allRestaurants]);

  if (isLoading) {
    return (
      <div className="favorites-container">
        <Header />
        <LoadingState />
      </div>
    );
  }

  const user = getAuth().currentUser;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <Header />
      <main className="favorites-main">
        <h1>Your Favorite Restaurants</h1>
        {favoriteRestaurants.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="favorites-grid">
            {favoriteRestaurants.map((restaurant) => (
              <FavoriteRestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
