import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initModalVars = {
    createConversation: boolean
    emojiModal: boolean
};

const initialState: initModalVars = {
    createConversation: false,
    emojiModal: false
};

export const Slice = createSlice({
    name: "ModalVars",
    initialState,
    reducers: {
        setCreateConversation: (state, { payload }: PayloadAction<boolean>) => {
            state.createConversation = payload;
        },
        setEmojiModal: (state, { payload }: PayloadAction<boolean>) => {
            state.emojiModal = payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const ModalVarsVarsActions = Slice.actions;

export default Slice.reducer;
