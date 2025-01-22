import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export type UserInfo = {
    uid: string;
    customerId?: string;
    type: "HOST" | "VISITOR" | "PENDING"
};

type UserAuthStateT = {
    isLogin: boolean;
    user: UserInfo | null;
    isLoading: boolean;
};

const initialState: UserAuthStateT = {
    isLogin: false,
    user: null,
    isLoading: true,
};

export const Slice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<any>) => {
            state.user = payload;
        },
        setIsLogin: (state, { payload }: PayloadAction<boolean>) => {
            state.isLogin = payload;
        },
        setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const UserSliceActions = Slice.actions;

export default Slice.reducer;
