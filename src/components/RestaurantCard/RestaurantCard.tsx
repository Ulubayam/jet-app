import React from "react";
import { useNavigate } from "react-router-dom";
import type { RestaurantCardProps } from "./RestaurantCard.types";
import "./RestaurantCard.css";

const FallbackIcon = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: "0.8em" }}>{children}</span>
);

export const RestaurantCard = ({
  id,
  logoUrl,
  name,
  rating,
  cuisines,
  deliveryCost,
  deliveryEtaMinutes,
  address,
  minimumDeliveryValue,
}: RestaurantCardProps) => {
  const navigate = useNavigate();
  const renderIcon = (type: "clock" | "delivery" | "money" | "star") => {
    const fallbacks = {
      clock: "⏱️",
      delivery: "🚚",
      money: "🧺",
      star: "★",
    };
    return <FallbackIcon>{fallbacks[type]}</FallbackIcon>;
  };

  const cuisineNames = cuisines.map((c) =>
    typeof c === "string" ? c : c.name
  );
  const ratingValue =
    typeof rating === "number" ? rating : rating?.starRating || 0;

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurant/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/restaurant/${id}`);
        }
      }}
    >
      <div className="restaurant-image-container">
        <img
          src={logoUrl}
          alt={name}
          className="restaurant-image"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/300x200?text=Restaurant+Image";
          }}
        />
      </div>

      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{name}</h3>
          <span className="restaurant-rating">
            {renderIcon("star")}
            {Number(ratingValue).toFixed(1)}
          </span>
        </div>
        <p className="restaurant-address" title={address.city}>
          {address.city}, {address.firstLine}, {address.postalCode}
        </p>
        <p className="restaurant-cuisines" title={cuisineNames.join(", ")}>
          {cuisineNames.join(", ")}
        </p>
        <div className="restaurant-meta">
          <span title="Delivery time">
            {renderIcon("clock")}
            {deliveryEtaMinutes?.rangeLower}-{deliveryEtaMinutes?.rangeUpper}{" "}
            mins
          </span>
          <span
            title="Delivery fee"
            className={deliveryCost === 0 ? "free-delivery" : ""}
          >
            {renderIcon("delivery")}
            {deliveryCost === 0 ? "Free" : `$${deliveryCost}`}
          </span>
          <span
            title="Minimum order"
            className={minimumDeliveryValue === 0 ? "no-minimum" : ""}
          >
            {renderIcon("money")}
            {minimumDeliveryValue === 0 ? "No min" : `$${minimumDeliveryValue}`}
          </span>
        </div>
      </div>
    </div>
  );
};
