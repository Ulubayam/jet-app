import { RestaurantCard } from "../../../components/RestaurantCard/RestaurantCard";
import type { Restaurant } from "redux/restaurant/types";

const defaultRating = { count: 0, starRating: 0, userRating: 0 };
const defaultCuisine = [{ name: "", uniqueName: "" }];
const defaultAddress = {
  city: "",
  firstLine: "",
  postalCode: "",
  location: {
    type: "Point" as const,
    coordinates: [0, 0] as [number, number],
  },
};

const defaultAvailability = {
  delivery: {
    isOpen: false,
    canPreOrder: false,
    isTemporarilyOffline: true,
    etaMinutes: { rangeLower: 0, rangeUpper: 0 },
    nextAvailability: {
      from: "",
      etaMinutes: { rangeLower: 0, rangeUpper: 0 },
    },
  },
  collection: {
    isOpen: false,
    canPreOrder: false,
    isTemporarilyOffline: true,
    etaMinutes: { rangeLower: 0, rangeUpper: 0 },
    nextAvailability: {
      from: "",
      etaMinutes: { rangeLower: 0, rangeUpper: 0 },
    },
  },
};

interface FavoriteRestaurantCardProps {
  restaurant: Restaurant;
}

export const FavoriteRestaurantCard = ({
  restaurant,
}: FavoriteRestaurantCardProps) => (
  <div className="favorite-card-wrapper">
    <RestaurantCard
      id={restaurant.id}
      logoUrl={restaurant.logoUrl}
      name={restaurant.name}
      rating={restaurant.rating || defaultRating}
      cuisines={restaurant.cuisines || defaultCuisine}
      deliveryEtaMinutes={restaurant.availability?.delivery?.etaMinutes}
      deliveryCost={0}
      minimumDeliveryValue={restaurant.minimumDeliveryValue || 0}
      address={{
        ...defaultAddress,
        ...restaurant.address,
        location: {
          ...defaultAddress.location,
          ...(restaurant.address?.location || {}),
        },
      }}
      availability={{
        ...defaultAvailability,
        ...restaurant.availability,
        delivery: {
          ...defaultAvailability.delivery,
          ...restaurant.availability?.delivery,
          nextAvailability: {
            ...defaultAvailability.delivery.nextAvailability,
            ...restaurant.availability?.delivery?.nextAvailability,
          },
        },
      }}
      isDelivery={restaurant.isDelivery || false}
      isNew={restaurant.isNew || false}
    />
  </div>
);
