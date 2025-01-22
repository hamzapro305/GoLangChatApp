import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initGlobalVars = {
    token: string | null
    ws: WebSocket | null
};

const initialState: initGlobalVars = {
    token: null,
    ws: null
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
    },
});

// Action creators are generated for each case reducer function
export const GlobalVarsActions = Slice.actions;

export default Slice.reducer;
