import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages, addMessage } from '../slices/chatSlice';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from 'axios'


export const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { channels, messages, loading, error } = useSelector(state => state.chat)
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const [newMessage, setNewMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState(null)

  if (!token) return <Navigate to="/login" />

  useEffect(() => {
    const socket = io('https://frontend-project-12-5cf7.onrender.com', {
      auth: { token }
    })
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })
    dispatch(fetchChannels())
    dispatch(fetchMessages())
    return () => {
      socket.off('newMessage')
      socket.disconnect()
    }

  }, [dispatch, token])

  useEffect(() => {
    if (channels.length > 0 && !activeChannel) {
      setActiveChannel(channels[0].id)
    }
  }, [channels, activeChannel])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleSendMessage = async () => {
    try {
      await axios.post('/api/v1/messages', {
        body: newMessage,
        channelId: activeChannel,
        username
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setNewMessage('')
    } catch (err) {
      console.error(err)
      alert('Ошибка сети')
    }
  }

  if (loading) return <div>Выполняется загрузка, пожалуйста подождите</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!activeChannel) return <div>Загрузка канала...</div>

  return (
    <div>
      <h1>Домашняя страница</h1>
      <button type="button" onClick={handleLogout}>Back</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '200px' }}>
          <h2>Каналы</h2>
          <ul>
            {channels.map(channel => (
              <li
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                style={{
                  cursor: 'pointer',
                  fontWeight: channel.id === activeChannel ? 'bold' : 'normal'
                }}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ flex: 1 }}>
            <h2>Чат</h2>
            <a>Сообщения</a>
            <ul>
              {messages.filter(m => m.channelId === activeChannel).map(message => (
                <li key={message.id}>
                  <b>{message.username}:</b> {message.body}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение"
            />
            <button onClick={handleSendMessage} disabled={!newMessage.trim()}>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  )
};