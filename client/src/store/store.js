// import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './userSlice'
// import productReducer from './productSlice'
// import cartReducer from './cartProduct'
// import addressReducer from './addressSlice'
// import orderReducer from './orderSlice'




// export const store = configureStore({
//   reducer: {
//     user : userReducer,
//     product : productReducer,
//     cartItem : cartReducer,
//     addresses : addressReducer,
//     orders : orderReducer
//   },
// })
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartProduct';
import addressReducer from './addressSlice';
import orderReducer from './orderSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ✅ Import storage

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cartItem: cartReducer,
  addresses: addressReducer,
  orders: orderReducer,
});

// Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['product', 'cartItem'], // ✅ Only persist 'product' & 'cartItem'
  // blacklist: ['user'], // You can blacklist slices you don’t want to persist
};

// Apply persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
