import type { Restaurant } from '../redux/restaurant/types';

export const filterRestaurants = (
  restaurants: Restaurant[],
  searchQuery: string,
  filter: string
): Restaurant[] => {
  let result = [...restaurants];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((restaurant) => {
      const { address, cuisines } = restaurant;

      const addressMatch =
        (address.city?.toLowerCase() || '').includes(query) ||
        (address.firstLine?.toLowerCase() || '').includes(query) ||
        (address.postalCode?.toLowerCase() || '').includes(query);

      const cuisineMatch = cuisines.some((cuisine) =>
        cuisine.name.toLowerCase().includes(query)
      );

      return addressMatch || cuisineMatch;
    });
  }

  if (filter === "rating") {
    result.sort((a, b) => (b.rating?.starRating || 0) - (a.rating?.starRating || 0));
  } else if (filter === "minOrder") {
    result.sort((a, b) => (a.minimumDeliveryValue || 0) - (b.minimumDeliveryValue || 0));
  }

  return result;
};

export const paginateItems = <T>(items: T[], currentPage: number, itemsPerPage: number): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
};
