import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
  name: string
  role: string
  email: string
  avatar?: string | null
  token?: string | null
  remenber: boolean | false
  expires: Date | string
  lastEmail?: string | null
}

type UserState = {
  user: User | null
}

const initialState: UserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state) => {
      const user = sessionStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
      }
    },
    validateToken: (state) => {
      const user = sessionStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
      }

      if (state.user) {
        const expires = new Date(state.user.expires)
        const now = new Date()
        if (expires < now) {
          state.user = null
          sessionStorage.removeItem('user')
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      sessionStorage.setItem('user', JSON.stringify(action.payload))
    },
    clearUser: (state) => {
      state.user = null
      sessionStorage.removeItem('user')
    }
  }
})

export const { getUser, setUser, clearUser } = userSlice.actions

export default userSlice.reducer