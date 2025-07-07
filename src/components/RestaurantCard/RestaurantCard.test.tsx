import { screen, fireEvent } from "@testing-library/react";
import { RestaurantCard } from "./RestaurantCard";
import { createMockRestaurant } from "../../test-utils/mockRestaurant";
import { createMockRestaurantCardProps, renderWithRouter } from "../../utils/testUtils";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RestaurantCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render restaurant card with all basic information", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-123",
      name: "Test Restaurant",
      cuisines: [
        { name: "Italian", uniqueName: "italian" },
        { name: "Pizza", uniqueName: "pizza" }
      ],
      address: {
        firstLine: "123 Test Street",
        city: "Test City",
        postalCode: "TE1 1ST"
      },
      deliveryEtaMinutes: {
        rangeLower: 30,
        rangeUpper: 45
      },
      deliveryCost: 299,
      minimumDeliveryValue: 1500,
      rating: {
        starRating: 4.5
      }
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(
      screen.getByText("Test City, 123 Test Street, TE1 1ST")
    ).toBeInTheDocument();
    expect(screen.getByText("Italian, Pizza")).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
    expect(screen.getByText("$1500")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("should render restaurant image with correct attributes", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-123",
      name: "Test Restaurant",
      logoUrl: "https://example.com/logo.png"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    const image = screen.getByAltText("Test Restaurant");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/logo.png");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveClass("restaurant-image");
  });

  it("should navigate to restaurant detail page when card is clicked", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-restaurant-123",
      name: "Test Restaurant"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    fireEvent.click(screen.getByText("Test Restaurant"));

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/test-restaurant-123");
  });

  it("should navigate to restaurant detail page when Enter key is pressed", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-restaurant-123",
      name: "Test Restaurant"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/test-restaurant-123");
  });

  it("should navigate to restaurant detail page when Space key is pressed", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-restaurant-123",
      name: "Test Restaurant"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: " " });

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/test-restaurant-123");
  });

  it("should not navigate when other keys are pressed", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-restaurant-123",
      name: "Test Restaurant"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Tab" });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should handle image loading error by setting fallback image", () => {
    const mockRestaurant = createMockRestaurant({
      id: "test-123",
      name: "Test Restaurant",
      logoUrl: "https://example.com/logo.png"
    });

    renderWithRouter(<RestaurantCard {...mockRestaurant} />);

    const image = screen.getByAltText("Test Restaurant");
    fireEvent.error(image);

    expect(image).toHaveAttribute(
      "src",
      "https://via.placeholder.com/300x200?text=Restaurant+Image"
    );
  });

  it("should render with correct CSS classes", () => {
    const props = createMockRestaurantCardProps();

    const { container } = renderWithRouter(<RestaurantCard {...props} />);

    const card = container.querySelector(".restaurant-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("restaurant-card");
  });

  it("should display rating with star icon", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const ratingContainer = screen
      .getByText("4.5")
      .closest(".restaurant-rating");
    expect(ratingContainer).toBeInTheDocument();
    expect(ratingContainer).toHaveTextContent("★");
  });

  it("should display delivery cost with delivery icon and dollar sign", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const deliveryCostElement = screen.getByText("$2.99");
    expect(deliveryCostElement).toBeInTheDocument();
    expect(deliveryCostElement.closest("span")).toHaveTextContent("🚚");
  });

  it("should display minimum delivery value with money icon and dollar sign", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const minDeliveryElement = screen.getByText("$15");
    expect(minDeliveryElement).toBeInTheDocument();
    expect(minDeliveryElement.closest("span")).toHaveTextContent("🧺");
  });

  it("should handle missing delivery time range gracefully", () => {
    const props = createMockRestaurantCardProps({
      deliveryEtaMinutes: { rangeLower: undefined, rangeUpper: undefined },
    });

    renderWithRouter(<RestaurantCard {...props} />);

    expect(screen.getByText("- mins")).toBeInTheDocument();
  });

  it("should handle missing address fields gracefully", () => {
    const props = createMockRestaurantCardProps({
      address: {
        firstLine: undefined,
        city: undefined,
        postalCode: undefined,
      },
    });

    renderWithRouter(<RestaurantCard {...props} />);

    expect(
      screen.getByText((_, node) => {
        const hasText = (node: Element) =>
          node.textContent?.replace(/\s+/g, "") === ",,";
        const nodeHasText = hasText(node as Element);
        const childrenDontHaveText = Array.from(node?.children || []).every(
          (child) => !hasText(child as Element)
        );
        return nodeHasText && childrenDontHaveText;
      })
    ).toBeInTheDocument();
  });

  it("should handle empty cuisines array", () => {
    const props = createMockRestaurantCardProps({
      cuisines: [],
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const cuisinesElement = document.querySelector(".restaurant-cuisines");
    expect(cuisinesElement).toBeInTheDocument();
    expect(cuisinesElement?.textContent).toBe("");
  });

  it("should format rating to one decimal place", () => {
    const props = createMockRestaurantCardProps({
      rating: { starRating: 4.567 },
    });

    renderWithRouter(<RestaurantCard {...props} />);

    expect(screen.getByText("4.6")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("should display cuisines with proper title attribute", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const cuisinesElement = screen.getByText("Italian, Pizza");
    expect(cuisinesElement).toHaveAttribute("title", "Italian, Pizza");
  });

  it("should display address with proper title attribute", () => {
    const props = createMockRestaurantCardProps();

    renderWithRouter(<RestaurantCard {...props} />);

    const addressElement = screen.getByText(
      "Test City, 123 Test Street, TE1 1ST"
    );
    expect(addressElement).toHaveAttribute("title", "Test City");
  });

  it("should display free delivery with special styling when delivery cost is 0", () => {
    const props = createMockRestaurantCardProps({
      deliveryCost: 0,
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const freeDeliveryElement = screen.getByText("Free");
    expect(freeDeliveryElement).toBeInTheDocument();
    expect(freeDeliveryElement.closest("span")).toHaveClass("free-delivery");
    expect(freeDeliveryElement.closest("span")).toHaveTextContent("🚚");
  });

  it("should display no minimum order with special styling when minimum delivery value is 0", () => {
    const props = createMockRestaurantCardProps({
      minimumDeliveryValue: 0,
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const noMinElement = screen.getByText("No min");
    expect(noMinElement).toBeInTheDocument();
    expect(noMinElement.closest("span")).toHaveClass("no-minimum");
    expect(noMinElement.closest("span")).toHaveTextContent("🧺");
  });

  it("should display both free delivery and no minimum order when both values are 0", () => {
    const props = createMockRestaurantCardProps({
      deliveryCost: 0,
      minimumDeliveryValue: 0,
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const freeDeliveryElement = screen.getByText("Free");
    const noMinElement = screen.getByText("No min");

    expect(freeDeliveryElement).toBeInTheDocument();
    expect(noMinElement).toBeInTheDocument();
    expect(freeDeliveryElement.closest("span")).toHaveClass("free-delivery");
    expect(noMinElement.closest("span")).toHaveClass("no-minimum");
  });

  it("should display regular delivery cost when delivery cost is greater than 0", () => {
    const props = createMockRestaurantCardProps({
      deliveryCost: 3.5,
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const deliveryCostElement = screen.getByText("$3.5");
    expect(deliveryCostElement).toBeInTheDocument();
    expect(deliveryCostElement.closest("span")).not.toHaveClass(
      "free-delivery"
    );
  });

  it("should display regular minimum order when minimum delivery value is greater than 0", () => {
    const props = createMockRestaurantCardProps({
      minimumDeliveryValue: 25,
    });

    renderWithRouter(<RestaurantCard {...props} />);

    const minOrderElement = screen.getByText("$25");
    expect(minOrderElement).toBeInTheDocument();
    expect(minOrderElement.closest("span")).not.toHaveClass("no-minimum");
  });
});
