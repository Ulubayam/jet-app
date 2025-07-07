import { all, fork } from "redux-saga/effects";
import authSaga from "../redux/auth/authSaga";
import restaurantSaga from "../redux/restaurant/restaurantSaga";

export default function* rootSaga() {
  yield all([fork(authSaga), fork(restaurantSaga)]);
}
