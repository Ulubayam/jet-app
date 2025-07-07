export interface Rating {
  count?: number;
  starRating?: number;
  userRating?: number;
}

export interface EtaMinutes {
  rangeLower: number;
  rangeUpper: number;
}

export interface Deal {
  description: string;
  offerType: string;
}

export interface Cuisine {
  name: string;
  uniqueName: string;
}

export interface DeliveryInfo {
  isOpen: boolean;
  canPreOrder: boolean;
  isTemporarilyOffline: boolean;
  nextAvailability: {
    from: string;
    etaMinutes?: {
      rangeLower: number;
      rangeUpper: number;
    };
  };
  etaMinutes: EtaMinutes;
}

export interface Availability {
  delivery: DeliveryInfo;
}

export interface Address {
  firstLine?: string;
  city?: string;
  postalCode?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface DeliveryEtaMinutes {
  rangeLower?: number;
  rangeUpper?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  uniqueName: string;
  address: Address;
  rating: Rating;
  isNew: boolean;
  driveDistanceMeters: number;
  openingTimeLocal: string;
  deliveryOpeningTimeLocal: string;
  deliveryEtaMinutes: DeliveryEtaMinutes;
  isCollection: boolean;
  isDelivery: boolean;
  isOpenNowForCollection: boolean;
  isOpenNowForDelivery: boolean;
  isOpenNowForPreorder: boolean;
  isTemporarilyOffline: boolean;
  deliveryCost: number;
  minimumDeliveryValue: number;
  defaultDisplayRank: number;
  isTemporaryBoost: boolean;
  isPremier: boolean;
  logoUrl: string;
  isTestRestaurant: boolean;
  deals: Deal[];
  tags: string[];
  cuisines: Cuisine[];
  availability: Availability;
  isFavorite?: boolean;
}

export interface Filter {
  displayName: string;
  imageName: string;
  group: string;
  restaurantIds: string[];
}

export interface Filters {
  [key: string]: Filter[];
}

export interface JetApiResponse {
  restaurants: Restaurant[];
  filters: Filters;
  area?: {
    postcode: string;
    name: string;
  };
  postcode: string;
  name: string;
}

export interface RestaurantState {
  list: Restaurant[];
  loading: boolean;
  error: string | null;
  currentPostcode: string | null;
  currentAreaName: string | null;
}
