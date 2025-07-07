import { render } from "@testing-library/react";
import { RestaurantCardSkeleton } from "./RestaurantCardSkeleton";

describe("RestaurantCardSkeleton Component", () => {
  it("should render the skeleton component", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const skeletonCard = container.querySelector(".restaurant-card.skeleton");
    expect(skeletonCard).toBeInTheDocument();
  });

  it("should have the correct CSS classes for skeleton styling", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const card = container.querySelector(".restaurant-card");
    expect(card).toHaveClass("restaurant-card", "skeleton");
  });

  it("should render skeleton image placeholder", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const skeletonImage = container.querySelector(
      ".restaurant-image.skeleton-image"
    );
    expect(skeletonImage).toBeInTheDocument();
  });

  it("should render skeleton restaurant info section", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const restaurantInfo = container.querySelector(".restaurant-info");
    expect(restaurantInfo).toBeInTheDocument();
  });

  it("should render skeleton restaurant header with title and rating", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const restaurantHeader = container.querySelector(".restaurant-header");
    expect(restaurantHeader).toBeInTheDocument();

    const skeletonTitle = container.querySelector(".skeleton-title");
    expect(skeletonTitle).toBeInTheDocument();

    const skeletonRating = container.querySelector(".skeleton-rating");
    expect(skeletonRating).toBeInTheDocument();
  });

  it("should render skeleton cuisine line", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const skeletonCuisine = container.querySelector(".skeleton-cuisine");
    expect(skeletonCuisine).toBeInTheDocument();
  });

  it("should render skeleton restaurant meta information", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const restaurantMeta = container.querySelector(".restaurant-meta");
    expect(restaurantMeta).toBeInTheDocument();

    const skeletonMetaElements = container.querySelectorAll(".skeleton-meta");
    expect(skeletonMetaElements).toHaveLength(2);
  });

  it("should render skeleton price information", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const skeletonPrice = container.querySelector(".skeleton-price");
    expect(skeletonPrice).toBeInTheDocument();
  });

  it("should render all skeleton line elements with correct classes", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const skeletonLines = container.querySelectorAll(".skeleton-line");
    expect(skeletonLines).toHaveLength(6);
  });

  it("should maintain proper DOM structure", () => {
    const { container } = render(<RestaurantCardSkeleton />);

    const card = container.querySelector(".restaurant-card");
    const image = card?.querySelector(".restaurant-image");
    const info = card?.querySelector(".restaurant-info");

    expect(card).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(info).toBeInTheDocument();

    const header = info?.querySelector(".restaurant-header");
    const cuisine = info?.querySelector(".skeleton-cuisine");
    const meta = info?.querySelector(".restaurant-meta");
    const price = info?.querySelector(".skeleton-price");

    expect(header).toBeInTheDocument();
    expect(cuisine).toBeInTheDocument();
    expect(meta).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });
});
