import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { Restaurant } from "../redux/restaurant/types";
import type { RestaurantCardProps } from "../components/RestaurantCard/RestaurantCard.types";
import type { RestaurantCardDetailProps } from "../components/RestaurantCardDetail/RestaurantCardDetail.types";

export const baseMockRestaurant: Partial<Restaurant> = {
  id: "restaurant-123",
  logoUrl: "https://example.com/logo.png",
  name: "Test Restaurant",
  cuisines: [
    { name: "Italian", uniqueName: "italian" },
    { name: "Pizza", uniqueName: "pizza" },
  ],
  address: {
    firstLine: "123 Test Street",
    city: "Test City",
    postalCode: "TE1 1ST",
  },
  rating: { starRating: 4.5 },
  minimumDeliveryValue: 15,
  availability: {
    delivery: {
      isOpen: true,
      canPreOrder: false,
      isTemporarilyOffline: false,
      nextAvailability: {
        from: "2024-01-01T10:00:00Z",
        etaMinutes: { rangeLower: 25, rangeUpper: 35 },
      },
      etaMinutes: { rangeLower: 25, rangeUpper: 35 },
    },
  },
  isDelivery: true,
  isNew: false,
  deliveryCost: 2.99,
  deliveryEtaMinutes: { rangeLower: 25, rangeUpper: 35 },
};

export const createMockRestaurantCardProps = (
  overrides: Partial<RestaurantCardProps> = {}
): RestaurantCardProps => ({
  ...baseMockRestaurant,
  ...overrides,
} as RestaurantCardProps);

export const createMockRestaurantCardDetailProps = (
  overrides: Partial<RestaurantCardDetailProps> = {}
): RestaurantCardDetailProps => ({
  ...baseMockRestaurant,
  deals: [
    { description: "20% off on orders above £20", offerType: "discount" },
    { description: "Free delivery on first order", offerType: "delivery" },
    { description: "", offerType: "empty" },
  ],
  ...overrides,
} as RestaurantCardDetailProps);

export const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
};

export const TEST_RESTAURANT_ID = "restaurant-123";
export const TEST_RESTAURANT_NAME = "Test Restaurant";
export const TEST_ADDRESS = {
  firstLine: "123 Test Street",
  city: "Test City", 
  postalCode: "TE1 1ST",
};
export const TEST_CUISINES = [
  { name: "Italian", uniqueName: "italian" },
  { name: "Pizza", uniqueName: "pizza" },
];

export const setupTestMocks = () => {
  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(),
  }));

  return { mockNavigate };
};

export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(BrowserRouter, null, children);
};

export const renderWithRouter = (component: React.ReactElement) => {
  return render(React.createElement(BrowserRouter, null, component));
}; 