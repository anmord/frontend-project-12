import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username,
        password,
      })

      const { token, username: name } = response.data

      if (!token) {
        throw new Error('No token')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('username', name)

      return { token, username: name }
    }
    catch (err) {
      return rejectWithValue(err.response?.status || 'NETWORK_ERROR')
    }
  },
)

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/signup', {
        username,
        password,
      })

      const { token, username: name } = response.data

      if (!token) {
        throw new Error('No token received')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('username', name)

      return { token, username: name }
    }
    catch (err) {
      return rejectWithValue(err.response?.status || 'NETWORK_ERROR')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.username = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
