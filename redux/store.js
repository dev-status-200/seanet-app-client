import { configureStore } from '@reduxjs/toolkit'
import counterReducer  from './features/counterSlice'
import themeSlice from './features/themeSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeSlice,
  },
})