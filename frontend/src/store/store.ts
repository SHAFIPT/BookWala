import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice"; 
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// Configuration for Redux Persist
const persistConfig = {
    key: "root", // Key for storage
    storage,     // Local storage
};

// Combine reducers (if you have multiple slices)
const rootReducer = combineReducers({
    user: userReducer, 
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Redux Persist
        }),
});

// Create Persistor
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
