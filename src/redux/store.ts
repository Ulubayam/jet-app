import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import restaurantReducer from "./restaurant/restaurantSlice";
import authReducer from "./auth/authSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: {} }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
