import { configureStore } from "@reduxjs/toolkit";
import ModalVars from "./slices/ModalVars";
import ChatSlice from "./slices/ChatSlice";
import GlobalVars from "./slices/GlobalVars";

export const makeStore = () => {
    return configureStore({
        reducer: {
            GlobalVars: GlobalVars,
            ModalVars: ModalVars,
            Chat: ChatSlice
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
