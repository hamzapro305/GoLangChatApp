import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type User = {
    id: string
    name: string
    email: string
    createdAt: string
}

type initGlobalVars = {
    token: string | null
    ws: WebSocket | null
    user: User | null
};

const initialState: initGlobalVars = {
    token: null,
    ws: null,
    user: null
};

export const Slice = createSlice({
    name: "GlobalVars",
    initialState,
    reducers: {
        setRedirectUrlAfterLogin: (
            state,
            { payload }: PayloadAction<initGlobalVars["token"]>
        ) => {
            state.token = payload;
        },
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
    },
});

// Action creators are generated for each case reducer function
export const GlobalVarsActions = Slice.actions;

export default Slice.reducer;
