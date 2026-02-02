import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: localStorage.getItem("lang") || "ar",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLang: (state) => {
      state.lang = state.lang === "en" ? "ar" : "en";
      localStorage.setItem("lang", state.lang);
    },
    setLang: (state, action) => {
      state.lang = action.payload;
      localStorage.setItem("lang", state.lang);
    },
  },
});

export const { toggleLang, setLang } = languageSlice.actions;
export default languageSlice.reducer;
