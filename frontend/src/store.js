import { configureStore } from '@reduxjs/toolkit'
import channelsReducer from './slices/channelsSlice'
import messagesReducer from './slices/messagesSlice'

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
})