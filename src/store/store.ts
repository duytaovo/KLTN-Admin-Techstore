import {
  AnyAction,
  Store,
  ThunkDispatch,
  configureStore,
} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import categoryReducer from "./category/categorySlice";
import brandReducer from "./brand/brandSlice";
import characterReducer from "./characteristic/characteristicSlice";
import depotReducer from "./depot/depotSlice";
import orderReducer from "./order/orderSlice";
import commentsReducer from "./comment/commentsSlice";
import filterReducer from "./product/filterSlice";
import searchSlice from "./search/searchSlice";
import voucherReducer from "./voucher/voucherSlice";
import productReducer from "./product/productSlice";
import entityReducer from "./entity/entitySlice";
import appReducer from "src/app.slice";
import statisticReducer from "./statistic/statisticSlice";

export const store = configureStore({
  reducer: {
    loading: appReducer,
    user: userReducer,
    orders: orderReducer,
    comment: commentsReducer,
    product: productReducer,
    category: categoryReducer,
    brand: brandReducer,
    voucher: voucherReducer,
    entity: entityReducer,
    character: characterReducer,
    depot: depotReducer,
    filter: filterReducer,
    search: searchSlice,
    statistic: statisticReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
  ],
});

// trích xuất type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 1. Get the root state's type from reducers

// 2. Create a type for thunk dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

// 3. Create a type for store using RootState and Thunk enabled dispatch
export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppThunkDispatch;
};

export default store;

