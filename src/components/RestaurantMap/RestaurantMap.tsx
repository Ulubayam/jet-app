import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { RestaurantMapProps } from "./RestaurantMap.types";
import "./RestaurantMap.css";

const getGoogleMapsApiKey = () => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  }
  return process.env.VITE_GOOGLE_MAPS_API_KEY || "";
};

export const RestaurantMap = ({ coordinates }: RestaurantMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: getGoogleMapsApiKey(),
  });

  const center = {
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0]),
  };

  return isLoaded ? (
    <GoogleMap mapContainerClassName="map-container" center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};
