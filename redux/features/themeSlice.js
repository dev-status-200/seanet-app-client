import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 'light',
}

export const themeSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    light: (state) => {
      state.value = 'light'
    },
    dark: (state) => {
      state.value = 'dark'
    },
  },
})

export const { light, dark } = themeSlice.actions

export default themeSlice.reducer