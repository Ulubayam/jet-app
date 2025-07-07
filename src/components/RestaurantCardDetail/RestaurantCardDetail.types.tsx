import type { Restaurant } from "redux/restaurant/types";

export type RestaurantCardDetailProps = Pick<
    Restaurant,
    'id' | 'logoUrl' | 'name' | 'cuisines' | 'address' |
    'deals' | 'minimumDeliveryValue' | 'availability' |
    'isDelivery' | 'isNew'
>;