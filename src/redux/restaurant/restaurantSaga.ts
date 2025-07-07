import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchRestaurantsRequest,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
} from "../../redux/restaurant/restaurantSlice";
import type { JetApiResponse, Restaurant } from "./types";

const API_BASE_URL = "/justeat/discovery/uk/restaurants/enriched/bypostcode/";

async function fetchRestaurantsAPI(postcode: string): Promise<JetApiResponse> {
  const API_URL = `${API_BASE_URL}${postcode}`;
  const res = await fetch(API_URL);

  if (!res.ok) {
    let errorMessage = `HTTP Error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = `API Error: ${res.status} - ${errorData.message}`;
      } else {
        const errorText = await res.text();
        errorMessage = `API Error: ${res.status} - ${errorText.substring(
          0,
          100
        )}...`;
      }
    } catch {
      errorMessage = `API Error: ${res.status} ${res.statusText} (Response could not be parsed)`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

function* handleFetchRestaurants(
  action: ReturnType<typeof fetchRestaurantsRequest>
) {
  try {
    const postcode = action.payload;

    const response: JetApiResponse = yield call(fetchRestaurantsAPI, postcode);

    const restaurants: Restaurant[] = response.restaurants;

    yield put(fetchRestaurantsSuccess(restaurants));
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    yield put(fetchRestaurantsFailure(errorMessage));
  }
}

export default function* restaurantSaga() {
  yield takeLatest(fetchRestaurantsRequest.type, handleFetchRestaurants);
}
