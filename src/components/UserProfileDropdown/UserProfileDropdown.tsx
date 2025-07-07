import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfileDropdownProps } from './UserProfleDropdown.types';
import './UserProfileDropdown.css';

export const UserProfileDropdown = ({ userEmail, onSignOut }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFavoritesClick = () => {
    navigate('/favorites');
    setIsOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsOpen(false);
  };

  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : 'U';

  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <button 
        className="user-profile-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          {avatarLetter}
        </div>
        <span className="user-email">{userEmail}</span>
        <span className="dropdown-chevron">▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={handleFavoritesClick}
          >
            Favorites
          </button>
          <button 
            className="dropdown-item sign-out"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
