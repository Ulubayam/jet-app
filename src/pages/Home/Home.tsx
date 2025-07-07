import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsRequest } from '../../redux/restaurant/restaurantSlice';
import { RestaurantCard } from '../../components/RestaurantCard/RestaurantCard';
import { RestaurantCardSkeleton } from '../../components/RestaurantCard/RestaurantCardSkeleton';
import { Header } from '../../components/Header/Header';
import { SearchIcon } from '../../assets/icons/SearchIcon';
import { Pagination } from '../../components/Pagination/Pagination';
import { useRestaurantFilters } from '../../hooks/useRestaurantFilters';
import type { Restaurant } from '../../redux/restaurant/types';
import type { RootState } from '../../redux/store';
import "./Home.css";

const ITEMS_PER_PAGE = 3;

export const Home = () => {
  const dispatch = useDispatch();
  const {
    list: restaurants,
    loading,
    error,
    currentPostcode,
  } = useSelector((state: RootState) => state.restaurant);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const { paginatedItems: currentItems, totalPages, filteredRestaurants } = useRestaurantFilters({
    restaurants,
    searchQuery,
    filter,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  useEffect(() => {
    const defaultPostcode = "G38AG";
    if (!currentPostcode) {
      dispatch(fetchRestaurantsRequest(defaultPostcode));
    }
  }, [dispatch, currentPostcode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <Header />
      <main className="home-wrapper">
        <div className="restaurant-list-container">
          <div className="filters-container">
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <SearchIcon size={18} color="#666" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by address or cuisine..."
                  className="search-input"
                  aria-label="Search restaurants"
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="filter-dropdown">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="filter-select"
                aria-label="Sort restaurants"
              >
                <option value="" disabled>
                  Sort by
                </option>
                <option value="rating">Rating (High to Low)</option>
                <option value="minOrder">Minimum Order (Low to High)</option>
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
          {loading ? (
            <>
              <RestaurantCardSkeleton />
              <RestaurantCardSkeleton />
              <RestaurantCardSkeleton />
            </>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <>
              {filteredRestaurants.length === 0 ? (
                <div className="no-results">
                  No restaurants found matching your search.
                </div>
              ) : (
                currentItems.map((restaurant: Restaurant) => (
                  <div key={restaurant.id}>
                    <RestaurantCard
                      id={restaurant.id}
                      logoUrl={restaurant.logoUrl}
                      name={restaurant.name}
                      rating={restaurant.rating}
                      cuisines={restaurant.cuisines}
                      deliveryCost={restaurant.deliveryCost}
                      deliveryEtaMinutes={restaurant.deliveryEtaMinutes}
                      address={restaurant.address}
                      minimumDeliveryValue={restaurant.minimumDeliveryValue}
                      availability={restaurant.availability}
                      isDelivery={restaurant.isDelivery}
                      isNew={restaurant.isNew}
                    />
                  </div>
                ))
              )}

              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};
