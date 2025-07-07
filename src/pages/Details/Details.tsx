import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RestaurantMap } from "../../components/RestaurantMap/RestaurantMap";
import { RestaurantCardDetail } from "../../components/RestaurantCardDetail/RestaurantCardDetail";
import { Header } from "../../components/Header/Header";

export const Details = () => {
  const { id } = useParams();
  const restaurant = useAppSelector((state) =>
    state.restaurant.list.find((r) => r.id === id)
  );

  if (!restaurant) return <div>Restaurant not found</div>;

  if (!restaurant.address.location?.coordinates) {
    return <div>Location information is not available for this restaurant</div>;
  }

  const [lng, lat] = restaurant.address.location.coordinates;

  return (
    <div>
      <Header />
      <div>
        <RestaurantCardDetail
          id={restaurant.id}
          logoUrl={restaurant.logoUrl}
          name={restaurant.name}
          cuisines={restaurant.cuisines}
          address={restaurant.address}
          deals={restaurant.deals}
          minimumDeliveryValue={restaurant.minimumDeliveryValue}
          availability={restaurant.availability}
          isDelivery={restaurant.isDelivery}
          isNew={restaurant.isNew}
        />
      </div>
      <div>
        <RestaurantMap coordinates={[lng.toString(), lat.toString()]} />
      </div>
    </div>
  );
};
