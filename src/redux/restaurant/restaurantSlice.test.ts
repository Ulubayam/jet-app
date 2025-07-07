import { configureStore } from '@reduxjs/toolkit';
import restaurantReducer, {
  fetchRestaurantsRequest,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
} from './restaurantSlice';
import type { Restaurant, RestaurantState } from './types';

type RootState = {
  restaurant: RestaurantState;
};

describe('restaurantSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;
  
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Test Restaurant 1',
      uniqueName: 'test-restaurant-1',
      address: {
        firstLine: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      },
      rating: {
        count: 100,
        starRating: 4.5,
        userRating: 4.5
      },
      isNew: false,
      driveDistanceMeters: 1200,
      openingTimeLocal: '10:00',
      deliveryOpeningTimeLocal: '10:00',
      deliveryEtaMinutes: {
        rangeLower: 20,
        rangeUpper: 30
      },
      isCollection: true,
      isDelivery: true,
      isOpenNowForCollection: true,
      isOpenNowForDelivery: true,
      isOpenNowForPreorder: false,
      isTemporarilyOffline: false,
      deliveryCost: 2.5,
      minimumDeliveryValue: 15,
      defaultDisplayRank: 1,
      isTemporaryBoost: false,
      isPremier: false,
      logoUrl: 'https://example.com/image1.jpg',
      isTestRestaurant: false,
      deals: [],
      tags: [],
      cuisines: [{ name: 'Test Cuisine', uniqueName: 'test-cuisine' }],
      availability: {
        delivery: {
          isOpen: true,
          canPreOrder: true,
          isTemporarilyOffline: false,
          nextAvailability: {
            from: '10:00'
          },
          etaMinutes: {
            rangeLower: 20,
            rangeUpper: 30
          }
        }
      }
    },
    {
      id: '2',
      name: 'Test Restaurant 2',
      uniqueName: 'test-restaurant-2',
      address: {
        firstLine: '456 Test Ave',
        city: 'Test City',
        postalCode: '12345'
      },
      rating: {
        count: 50,
        starRating: 4.0,
        userRating: 4.0
      },
      isNew: true,
      driveDistanceMeters: 1500,
      openingTimeLocal: '11:00',
      deliveryOpeningTimeLocal: '11:00',
      deliveryEtaMinutes: {
        rangeLower: 25,
        rangeUpper: 35
      },
      isCollection: true,
      isDelivery: true,
      isOpenNowForCollection: true,
      isOpenNowForDelivery: true,
      isOpenNowForPreorder: false,
      isTemporarilyOffline: false,
      deliveryCost: 3.0,
      minimumDeliveryValue: 20,
      defaultDisplayRank: 2,
      isTemporaryBoost: false,
      isPremier: true,
      logoUrl: 'https://example.com/image2.jpg',
      isTestRestaurant: false,
      deals: [],
      tags: [],
      cuisines: [{ name: 'Test Cuisine 2', uniqueName: 'test-cuisine-2' }],
      availability: {
        delivery: {
          isOpen: true,
          canPreOrder: true,
          isTemporarilyOffline: false,
          nextAvailability: {
            from: '11:00'
          },
          etaMinutes: {
            rangeLower: 25,
            rangeUpper: 35
          }
        }
      }
    }
  ];

  beforeEach(() => {
    store = configureStore<RootState>({
      reducer: {
        restaurant: restaurantReducer,
      },
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().restaurant).toEqual({
      list: [],
      loading: false,
      error: null,
      currentPostcode: null,
      currentAreaName: null
    });
  });

  describe('fetchRestaurantsRequest', () => {
    it('should set loading to true and update postcode', () => {
      const postcode = 'SW1A 1AA';
      
      store.dispatch(fetchRestaurantsRequest(postcode));
      
      expect(store.getState().restaurant).toMatchObject({
        loading: true,
        currentPostcode: postcode,
        error: null
      });
    });
  });

  describe('fetchRestaurantsSuccess', () => {
    it('should update restaurants list and set loading to false', () => {
      store.dispatch(fetchRestaurantsRequest('SW1A 1AA'));
      
      store.dispatch(fetchRestaurantsSuccess(mockRestaurants));
      
      const state = store.getState().restaurant;
      expect(state).toMatchObject({
        loading: false,
        list: mockRestaurants,
        error: null
      });
      expect(state.list).toHaveLength(2);
    });
  });

  describe('fetchRestaurantsFailure', () => {
    it('should set error and clear restaurants list', () => {
      const errorMessage = 'Failed to fetch restaurants';
      
      store.dispatch(fetchRestaurantsRequest('SW1A 1AA'));
      store.dispatch(fetchRestaurantsSuccess(mockRestaurants));
      
      store.dispatch(fetchRestaurantsFailure(errorMessage));
      
      expect(store.getState().restaurant).toMatchObject({
        loading: false,
        list: [],
        error: errorMessage
      });
    });
  });
});
