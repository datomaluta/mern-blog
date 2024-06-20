import { createSlice } from "@reduxjs/toolkit";

type currentUserType = {
  photo: string;
  username: string;
  email: string;
  role: string;
  _id: string;
};

const initialState: { currentUser: currentUserType | null } = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { saveUserInfo } = userSlice.actions;

export default userSlice.reducer;
