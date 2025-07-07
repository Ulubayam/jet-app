import type { Restaurant } from "redux/restaurant/types";

export type RestaurantCardProps = Pick<Restaurant, 'id' | 'logoUrl' | 'name' | 'rating' | 'cuisines' | 'address' | 'availability' | 'minimumDeliveryValue' | 'isDelivery' | 'isNew' | 'deliveryEtaMinutes' | 'deliveryCost'>;