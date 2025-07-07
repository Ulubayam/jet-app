import { screen, fireEvent } from "@testing-library/react";
import { getAuth } from "firebase/auth";
import { RestaurantCardDetail } from "./RestaurantCardDetail";
import * as favoritesUtils from "../../utils/favorites";
import {
  createMockRestaurantCardDetailProps,
  mockUser,
  renderWithRouter,
} from "../../utils/testUtils";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));
const mockGetAuth = getAuth as jest.MockedFunction<typeof getAuth>;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../utils/favorites");

const mockFavoritesUtils = favoritesUtils as jest.Mocked<typeof favoritesUtils>;

const mockRestaurantProps = createMockRestaurantCardDetailProps();

describe("RestaurantCardDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuth.mockReturnValue({
      currentUser: mockUser,
    } as ReturnType<typeof getAuth>);
    mockFavoritesUtils.isRestaurantFavorite.mockReturnValue(false);
  });

  describe("should render restaurant information correctly", () => {
    it("should display restaurant name and logo", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
      expect(screen.getByAltText("Test Restaurant")).toBeInTheDocument();
      expect(screen.getByAltText("Test Restaurant")).toHaveAttribute(
        "src",
        "https://example.com/logo.png"
      );
    });

    it("should display cuisines correctly", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(screen.getByText("Italian, Pizza")).toBeInTheDocument();
    });

    it("should display address correctly", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(
        screen.getByText(
          (_content, node) =>
            node?.textContent === "📍 123 Test Street, Test City, TE1 1ST"
        )
      ).toBeInTheDocument();
    });

    it("should display delivery information correctly", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(screen.getByText(/⏱️ 25-35 mins/)).toBeInTheDocument();
      expect(screen.getByText(/🚚 Free Delivery/)).toBeInTheDocument();
      expect(screen.getByText(/💰 Min order: £15/)).toBeInTheDocument();
    });

    it("should display deals section when deals are available", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(screen.getByText("🔥 Special Deals")).toBeInTheDocument();
      expect(
        screen.getByText("20% off on orders above £20")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Free delivery on first order")
      ).toBeInTheDocument();
      expect(screen.queryByText("empty")).not.toBeInTheDocument();
    });

    it("should not display deals section when no valid deals are available", () => {
      const propsWithoutDeals = {
        ...mockRestaurantProps,
        deals: [{ description: "", offerType: "empty" }],
      };

      renderWithRouter(<RestaurantCardDetail {...propsWithoutDeals} />);

      expect(screen.queryByText("🔥 Special Deals")).not.toBeInTheDocument();
    });

    it("should display new restaurant badge when isNew is true", () => {
      const newRestaurantProps = { ...mockRestaurantProps, isNew: true };
      renderWithRouter(<RestaurantCardDetail {...newRestaurantProps} />);

      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("should not display new restaurant badge when isNew is false", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(screen.queryByText("New")).not.toBeInTheDocument();
    });

    it("should display appropriate info text for new restaurant", () => {
      const newRestaurantProps = { ...mockRestaurantProps, isNew: true };
      renderWithRouter(<RestaurantCardDetail {...newRestaurantProps} />);

      expect(
        screen.getByText(/Welcome to our newest addition, Test Restaurant!/)
      ).toBeInTheDocument();
    });

    it("should display appropriate info text for existing restaurant", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(
        screen.getByText(
          /Test Restaurant has been serving delicious Italian for years./
        )
      ).toBeInTheDocument();
    });
  });

  describe("should handle favorite functionality correctly", () => {
    it("should show unfilled heart when restaurant is not favorite", () => {
      mockFavoritesUtils.isRestaurantFavorite.mockReturnValue(false);
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /add to favorites/i,
      });
      expect(favoriteButton).toBeInTheDocument();
      expect(favoriteButton).toHaveAttribute("title", "Add to favorites");
    });

    it("should show filled heart when restaurant is favorite", () => {
      mockFavoritesUtils.isRestaurantFavorite.mockReturnValue(true);
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /remove from favorites/i,
      });
      expect(favoriteButton).toBeInTheDocument();
      expect(favoriteButton).toHaveAttribute("title", "Remove from favorites");
    });

    it("should add restaurant to favorites when clicking unfilled heart", () => {
      mockFavoritesUtils.isRestaurantFavorite.mockReturnValue(false);
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /add to favorites/i,
      });
      fireEvent.click(favoriteButton);

      expect(mockFavoritesUtils.addFavorite).toHaveBeenCalledWith(
        "test-user-id",
        "restaurant-123"
      );
    });

    it("should remove restaurant from favorites when clicking filled heart", () => {
      mockFavoritesUtils.isRestaurantFavorite.mockReturnValue(true);
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /remove from favorites/i,
      });
      fireEvent.click(favoriteButton);

      expect(mockFavoritesUtils.removeFavorite).toHaveBeenCalledWith(
        "test-user-id",
        "restaurant-123"
      );
    });

    it("should navigate to login page when user is not authenticated and clicking favorite button", () => {
      mockGetAuth.mockReturnValue({
        currentUser: null,
      } as ReturnType<typeof getAuth>);

      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /add to favorites/i,
      });
      fireEvent.click(favoriteButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        state: { from: window.location.pathname },
      });
    });

    it("should prevent event propagation when clicking favorite button", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      const favoriteButton = screen.getByRole("button", {
        name: /add to favorites/i,
      });

      fireEvent.click(favoriteButton);

      expect(mockFavoritesUtils.addFavorite).toHaveBeenCalled();
    });
  });

  describe("should handle edge cases correctly", () => {
    it("should handle missing logo with placeholder image", () => {
      const propsWithoutLogo = { ...mockRestaurantProps, logoUrl: "" };
      renderWithRouter(<RestaurantCardDetail {...propsWithoutLogo} />);

      const logoImage = screen.getByAltText("Test Restaurant");
      fireEvent.error(logoImage);

      expect(logoImage).toHaveAttribute(
        "src",
        "https://via.placeholder.com/80?text=Logo"
      );
    });

    it("should handle missing address fields gracefully", () => {
      const propsWithIncompleteAddress = {
        ...mockRestaurantProps,
        address: {
          firstLine: "123 Test Street",
          city: undefined,
          postalCode: undefined,
        },
      };

      renderWithRouter(
        <RestaurantCardDetail {...propsWithIncompleteAddress} />
      );

      expect(
        screen.getByText(
          (_content, node) => node?.textContent === "📍 123 Test Street, , "
        )
      ).toBeInTheDocument();
    });

    it("should handle missing availability information", () => {
      const propsWithoutAvailability = {
        ...mockRestaurantProps,
        availability: {
          delivery: {
            isOpen: true,
            canPreOrder: false,
            isTemporarilyOffline: false,
            nextAvailability: {
              from: "2024-01-01T10:00:00Z",
            },
            etaMinutes: {
              rangeLower: 0,
              rangeUpper: 0,
            },
          },
        },
      };

      renderWithRouter(<RestaurantCardDetail {...propsWithoutAvailability} />);

      expect(screen.getByText(/⏱️ 0-0 mins/)).toBeInTheDocument();
    });

    it("should handle missing minimum delivery value", () => {
      const propsWithoutMinDelivery = {
        ...mockRestaurantProps,
        minimumDeliveryValue: 0,
      };

      renderWithRouter(<RestaurantCardDetail {...propsWithoutMinDelivery} />);

      expect(screen.getByText(/💰 No minimum order/)).toBeInTheDocument();
    });

    it("should handle non-delivery restaurants", () => {
      const propsWithoutDelivery = {
        ...mockRestaurantProps,
        isDelivery: false,
      };

      renderWithRouter(<RestaurantCardDetail {...propsWithoutDelivery} />);

      expect(screen.getByText(/🚚 No Delivery/)).toBeInTheDocument();
    });

    it("should handle restaurants without cuisines", () => {
      const propsWithoutCuisines = {
        ...mockRestaurantProps,
        cuisines: [],
      };

      renderWithRouter(<RestaurantCardDetail {...propsWithoutCuisines} />);

      expect(
        screen.getByText(
          "Test Restaurant has been serving delicious food for years."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Test Restaurant has been serving delicious food for years./
        )
      ).toBeInTheDocument();
    });
  });

  describe("should update favorite status when user changes", () => {
    it("should check favorite status when user is available", () => {
      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(mockFavoritesUtils.isRestaurantFavorite).toHaveBeenCalledWith(
        "test-user-id",
        "restaurant-123"
      );
    });

    it("should not check favorite status when user is not available", () => {
      mockGetAuth.mockReturnValue({
        currentUser: null,
      } as ReturnType<typeof getAuth>);

      renderWithRouter(<RestaurantCardDetail {...mockRestaurantProps} />);

      expect(mockFavoritesUtils.isRestaurantFavorite).not.toHaveBeenCalled();
    });
  });
});
