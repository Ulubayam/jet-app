import type { Restaurant } from '../redux/restaurant/types';

const DEFAULT_ADDRESS = {
  city: 'London',
  firstLine: '1 Test Street',
  postalCode: 'SW1A 1AA',
  location: {
    type: 'Point' as const,
    coordinates: [-0.1, 51.5]
  }
};

type PartialRestaurant = Partial<Restaurant> & { id: number | string; name: string };

export const createMockRestaurant = ({
  id,
  name,
  cuisine = 'International',
  ...overrides
}: PartialRestaurant & { cuisine?: string }): Restaurant => {
  const restaurantId = typeof id === 'number' ? `restaurant-${id}` : id;
  const numericId = typeof id === 'number' ? id : parseInt(id.replace(/\D/g, '')) || 1;

  const baseRestaurant: Restaurant = {
    id: restaurantId,
    name,
    uniqueName: `${name.toLowerCase().replace(/\s+/g, '-')}-${numericId}`,
    address: {
      ...DEFAULT_ADDRESS,
      firstLine: `${numericId} Test Street`,
      postalCode: `SW1A ${numericId}AA`.slice(0, 8)
    },
    rating: {
      count: 100 + numericId * 10,
      starRating: 4 + (numericId % 5) / 2,
      userRating: 4 + (numericId % 5) / 2
    },
    isNew: numericId % 3 === 0,
    driveDistanceMeters: 1000 + (numericId * 100),
    openingTimeLocal: '10:00',
    deliveryOpeningTimeLocal: '10:00',
    deliveryEtaMinutes: {
      rangeLower: 20 + numericId,
      rangeUpper: 40 + numericId
    },
    isCollection: true,
    isDelivery: true,
    isOpenNowForCollection: true,
    isOpenNowForDelivery: true,
    isOpenNowForPreorder: true,
    isTemporarilyOffline: false,
    deliveryCost: numericId % 2 === 0 ? 2.99 : 0,
    minimumDeliveryValue: 15.99,
    defaultDisplayRank: numericId,
    isTemporaryBoost: false,
    isPremier: numericId % 4 === 0,
    logoUrl: `https://example.com/restaurants/${numericId}/logo.jpg`,
    isTestRestaurant: true,
    deals: [],
    tags: [],
    cuisines: [{ name: cuisine, uniqueName: cuisine.toLowerCase() }],
    availability: {
      delivery: {
        isOpen: true,
        canPreOrder: true,
        isTemporarilyOffline: false,
        etaMinutes: {
          rangeLower: 20 + numericId,
          rangeUpper: 40 + numericId
        },
        nextAvailability: {
          from: '10:00',
          etaMinutes: {
            rangeLower: 20 + numericId,
            rangeUpper: 40 + numericId
          }
        }
      }
    }
  };

  return { ...baseRestaurant, ...overrides };
};

export const createMockRestaurants = (count: number, baseName = 'Restaurant'): Restaurant[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockRestaurant({
      id: `restaurant-${i + 1}`,
      name: `${baseName} ${i + 1}`,
      cuisine: ['Italian', 'Mexican', 'Japanese', 'Indian', 'Turkish'][i % 5]
    })
  );
};
