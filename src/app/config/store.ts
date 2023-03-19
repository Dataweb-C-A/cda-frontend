import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './reducers/themeSlice'
import userReducer from './reducers/usersSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
