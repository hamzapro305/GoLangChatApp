import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initGlobalVars = {
    token: string | null
};

const initialState: initGlobalVars = {
    token: null,
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
    },
});

// Action creators are generated for each case reducer function
export const GlobalVarsActions = Slice.actions;

export default Slice.reducer;
