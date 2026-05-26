import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const token = localStorage.getItem('token')

    const response = await axios.get('/api/v1/channels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  },
)

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (newChannel) => {
    const token = localStorage.getItem('token')

    const response = await axios.post(
      '/api/v1/channels',
      newChannel,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id) => {
    const token = localStorage.getItem('token')

    await axios.delete(`/api/v1/channels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return id
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }) => {
    const token = localStorage.getItem('token')

    const response = await axios.patch(
      `/api/v1/channels/${id}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  },
)

const channelsSlice = createSlice({
  name: 'channels',

  initialState: {
    channels: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },

  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },

    addChannel: (state, action) => {
      state.channels.push(action.payload)
    },

    updateChannel: (state, action) => {
      const updatedChannel = action.payload

      const index = state.channels.findIndex(
        channel => channel.id === updatedChannel.id,
      )

      if (index !== -1) {
        state.channels[index] = updatedChannel
      }
    },

    deleteChannel: (state, action) => {
      state.channels = state.channels.filter(
        channel => channel.id !== action.payload,
      )
    },
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

        if (action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id
        }
      })

      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const {
  setCurrentChannel,
  addChannel,
  updateChannel,
  deleteChannel,
} = channelsSlice.actions

export default channelsSlice.reducer