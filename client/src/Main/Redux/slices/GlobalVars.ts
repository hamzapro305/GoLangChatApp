import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type User = {
    id: string
    name: string
    email: string
    createdAt: string
}

type initGlobalVars = {
    ws: WebSocket | null
    isLogin: boolean
    isLoading: boolean
    user: User | null
};

const initialState: initGlobalVars = {
    ws: null,
    user: null,
    isLoading: true,
    isLogin: false,
};

export const Slice = createSlice({
    name: "GlobalVars",
    initialState,
    reducers: {
        setWebsocket: (
            state,
            { payload }: PayloadAction<initGlobalVars["ws"]>
        ) => {
            state.ws = payload;
        },
        setUser: (
            state,
            { payload }: PayloadAction<initGlobalVars["user"]>
        ) => {
            state.user = payload;
        },
        setIsLogin: (
            state,
            { payload }: PayloadAction<boolean>) => {
            state.isLogin = payload;
        },
        setIsLoading: (
            state,
            { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const GlobalVarsActions = Slice.actions;

export default Slice.reducer;
