import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store.js";
import { ReactNode, useMemo } from "react";

type StoreProviderType = { children: ReactNode };

const StoreProvider = ({ children }: StoreProviderType) => {
    const store: AppStore = useMemo(() => makeStore(), []);


    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
