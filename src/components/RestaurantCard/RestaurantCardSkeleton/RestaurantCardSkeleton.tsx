import "./RestaurantCardSkeleton.css";

export const RestaurantCardSkeleton = () => {
  return (
    <div className="restaurant-card skeleton">
      <div className="restaurant-image skeleton-image"></div>
      <div className="restaurant-info">
        <div className="restaurant-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-rating"></div>
        </div>
        <div className="skeleton-line skeleton-cuisine"></div>
        <div className="restaurant-meta">
          <span className="skeleton-line skeleton-meta"></span>
          <span className="skeleton-line skeleton-meta"></span>
        </div>
        <div className="skeleton-line skeleton-price"></div>
      </div>
    </div>
  );
};
