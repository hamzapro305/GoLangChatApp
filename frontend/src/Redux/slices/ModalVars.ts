import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initModalVars = {
    createConversation: boolean
};

const initialState: initModalVars = {
    createConversation: false,
};

export const Slice = createSlice({
    name: "ModalVars",
    initialState,
    reducers: {
        setCreateConversation: (state, { payload }: PayloadAction<boolean>) => {
            state.createConversation = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const ModalVarsVarsActions = Slice.actions;

export default Slice.reducer;
