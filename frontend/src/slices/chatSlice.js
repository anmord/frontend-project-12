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

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        channels: [],
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {},
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
    }
})

export default chatSlice.reducer