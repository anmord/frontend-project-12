import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const createChannel = createAsyncThunk(
  'chat/createChannels',
  async (newChannel) => {
    const token = localStorage.getItem('token')
    const response = await axios.post('/api/v1/channels', newChannel, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const removeChannel = createAsyncThunk(
  'chat/removeChannels',
  async (id) => {
    const token = localStorage.getItem('token')
    await axios.delete(`/api/v1/channels/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return id
  }
)

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }) => {
    const token = localStorage.getItem('token')
    const response = await axios.patch(`/api/v1/channels/${id}`, { name }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    currentChannelId: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload)
    },
    updateChannel: (state, action) => {
      const updated = action.payload
      const index = state.channels.findIndex(c => c.id === updated.id)
      if (index !== -1) {
        state.channels[index] = updated
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(c => c.id !== action.payload)
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = state.channels[0]?.id || null
        }
      })
  }
})

export const { addMessage, addChannel, updateChannel } = chatSlice.actions
export default chatSlice.reducer