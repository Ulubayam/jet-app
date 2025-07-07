import { useMemo } from 'react';
import { filterRestaurants, paginateItems } from '../utils/restaurantFilters';
import type { Restaurant } from '../redux/restaurant/types';

interface UseRestaurantFiltersProps {
  restaurants: Restaurant[];
  searchQuery: string;
  filter: string;
  currentPage: number;
  itemsPerPage: number;
}

export const useRestaurantFilters = ({
  restaurants,
  searchQuery,
  filter,
  currentPage,
  itemsPerPage,
}: UseRestaurantFiltersProps) => {
  const filteredRestaurants = useMemo(
    () => filterRestaurants(restaurants, searchQuery, filter),
    [restaurants, searchQuery, filter]
  );

  const paginatedItems = useMemo(
    () => paginateItems(filteredRestaurants, currentPage, itemsPerPage),
    [filteredRestaurants, currentPage, itemsPerPage]
  );

  return {
    filteredRestaurants,
    paginatedItems,
    totalPages: Math.ceil(filteredRestaurants.length / itemsPerPage),
  };
};
