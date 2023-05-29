import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
  id: string | number
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
      const user = localStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
      }
    },
    validateToken: (state) => {
      const user = localStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
      }

      if (state.user) {
        const expires = new Date(state.user.expires)
        const now = new Date()
        if (expires < now) {
          state.user = null
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
      localStorage.setItem('token', action.payload.token || '')
    },
    clearUser: (state) => {
      state.user = null
      localStorage.removeItem('user')
    }
  }
})

export const { getUser, setUser, clearUser } = userSlice.actions

export default userSlice.reducer