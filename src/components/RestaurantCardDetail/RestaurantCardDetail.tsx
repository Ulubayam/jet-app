import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { HeartIcon } from '../../assets/icons/HeartIcon';
import { isRestaurantFavorite, addFavorite, removeFavorite } from '../../utils/favorites';
import type { RestaurantCardDetailProps } from './RestaurantCardDetail.types';
import './RestaurantCardDetail.css';

export const RestaurantCardDetail = ({
  id,
  logoUrl,
  name,
  cuisines,
  address,
  deals,
  minimumDeliveryValue,
  availability,
  isDelivery,
  isNew,
}: RestaurantCardDetailProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const favorite = isRestaurantFavorite(user.uid, id);
      setIsFavorite(favorite);
    }
  }, [user, id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (isFavorite) {
      removeFavorite(user.uid, id);
    } else {
      addFavorite(user.uid, id);
    }
    
    setIsFavorite(!isFavorite);
  };
  const filteredDeals = deals?.filter((deal) => deal.description?.trim() !== '');

  return (
    <div className="restaurant-card-detail">
      <div className="restaurant-header">
        <div className="restaurant-logo">
          <img
            src={logoUrl}
            alt={name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/80?text=Logo';
            }}
          />
        </div>
        <div className="restaurant-info">
          <div className="restaurant-title">
            <h2>{name}</h2>
          </div>
          <div className="restaurant-title">

            <p>{cuisines.map(c => c.name).join(", ")}</p>
          </div>
        </div>
        <button
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon isFilled={isFavorite} />
        </button>
      </div>

      <div className="restaurant-details">
        <p className="address">
          <span>📍</span> {address.firstLine}, {address.city}, {address.postalCode}
        </p>

        <div className="meta-info">
          <span title="Delivery time">
            ⏱️ {availability?.delivery?.etaMinutes?.rangeLower}-{availability?.delivery?.etaMinutes?.rangeUpper} mins
          </span>
          <span title="isDelivery">
            🚚 {isDelivery ? "Free Delivery" : "No Delivery"}
          </span>
          <span title="Minimum order">
            💰 {minimumDeliveryValue ? `Min order: £${minimumDeliveryValue}` : 'No minimum order'}
          </span>
          {isNew && <div className="status-badge">
            <div className="new-status new" />
            <span> New </span>
          </div>}

        </div>
      </div>

      {filteredDeals && filteredDeals.length > 0 && (
        <div className="deals-section">
          <h3>🔥 Special Deals</h3>
          <ul className="deals-list">
            {filteredDeals.map((deal, index) => (
              <li key={index} className="deal-item">
                {deal.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="info-text">
        <p>
          {isNew
            ? `Welcome to our newest addition, ${name}! We're excited to serve you with delicious ${cuisines[0]?.name || 'food'}.`
            : `${name} has been serving delicious ${cuisines[0]?.name || 'food'} for years.`}
        </p>
      </div>
    </div>
  );
};
