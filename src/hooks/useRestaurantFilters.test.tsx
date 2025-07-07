import { renderHook } from '@testing-library/react';
import { useRestaurantFilters } from './useRestaurantFilters';
import { createMockRestaurants } from '../test-utils/mockRestaurant';

jest.mock('../utils/restaurantFilters', () => ({
  filterRestaurants: jest.fn((restaurants) => restaurants),
  paginateItems: jest.fn((items) => items.slice(0, 1)), 
}));

import { filterRestaurants, paginateItems } from '../utils/restaurantFilters';

describe('useRestaurantFilters', () => {
  const mockRestaurants = createMockRestaurants(3);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered and paginated restaurants', () => {
    (paginateItems as jest.Mock).mockImplementation((items) => [items[0]]);
    
    const { result } = renderHook(() =>
      useRestaurantFilters({
        restaurants: mockRestaurants,
        searchQuery: 'Pizza',
        filter: 'all',
        currentPage: 1,
        itemsPerPage: 10,
      })
    );

    expect(filterRestaurants).toHaveBeenCalledWith(mockRestaurants, 'Pizza', 'all');
    expect(paginateItems).toHaveBeenCalled();
    
    expect(result.current).toEqual({
      filteredRestaurants: mockRestaurants,
      paginatedItems: [mockRestaurants[0]],
      totalPages: 1,
    });
  });

  it('should handle empty restaurants array', () => {
    const { result } = renderHook(() =>
      useRestaurantFilters({
        restaurants: [],
        searchQuery: '',
        filter: 'all',
        currentPage: 1,
        itemsPerPage: 10,
      })
    );

    expect(result.current).toEqual({
      filteredRestaurants: [],
      paginatedItems: [],
      totalPages: 0,
    });
  });

  it('should recalculate when dependencies change', () => {
    const initialProps = {
      restaurants: mockRestaurants,
      searchQuery: '',
      filter: 'all',
      currentPage: 1,
      itemsPerPage: 2,
    };

    const { result, rerender } = renderHook(
      (props) => useRestaurantFilters(props),
      { initialProps }
    );

    const firstResult = result.current;

    rerender({ ...initialProps, searchQuery: 'pizza' });
    expect(result.current).not.toBe(firstResult);
    expect(filterRestaurants).toHaveBeenCalledWith(
      mockRestaurants,
      'pizza',
      'all'
    );
  });

  it('should handle different items per page', () => {
    const { result } = renderHook(() =>
      useRestaurantFilters({
        restaurants: mockRestaurants,
        searchQuery: '',
        filter: 'all',
        currentPage: 1,
        itemsPerPage: 1,
      })
    );

    expect(paginateItems).toHaveBeenCalledWith(
      expect.any(Array),
      1,
      1
    );
    expect(result.current.totalPages).toBe(3);
  });
});
