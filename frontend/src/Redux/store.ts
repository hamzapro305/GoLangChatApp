import { configureStore } from "@reduxjs/toolkit";
import GlobalVars from "@/Redux/slices/GlobalVars";
import UserSlice from "./slices/UserSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            GlobalVars: GlobalVars,
            UserAuth: UserSlice,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

// Infer the type of makeStore
// export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
