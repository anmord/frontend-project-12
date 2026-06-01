import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import {
  addChannel,
  updateChannel,
  deleteChannel,
  fetchChannels,
} from '../slices/channelsSlice'

import {
  addMessage,
  fetchMessages,
} from '../slices/messagesSlice'

export const useChatSocket = (token) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token) {
      return
    }

    const socket = io('/', {
      auth: { token },
    })

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel))
    })

    socket.on('renameChannel', (channel) => {
      dispatch(updateChannel(channel))
    })

    socket.on('removeChannel', ({ id }) => {
      dispatch(deleteChannel(id))
    })

    dispatch(fetchChannels())
    dispatch(fetchMessages())

    return () => {
      socket.off('newMessage')
      socket.off('newChannel')
      socket.off('renameChannel')
      socket.off('removeChannel')
      socket.disconnect()
    }
  }, [dispatch, token])
}
