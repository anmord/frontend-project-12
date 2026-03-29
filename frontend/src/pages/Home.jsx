import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages } from '../slices/chatSlice';
import { useEffect } from 'react';


export const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { channels, messages, loading, error } = useSelector(state => state.chat)
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/login" />

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) return <div>Выполняется загрузка, пожалуйста подождите</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <div>
      <h1>Домашняя страница</h1>
      <button type="submit" onClick={handleLogout}>Back</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '200px' }}>
          <h2>Каналы</h2>
          <ul>
            {channels.map(channel => <li key={channel.id}>{channel.name}</li>)}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Чат</h2>
          <ul>
            {messages.map(message => (
              <li key={message.id}>
                <b>{message.username}:</b> {message.body}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
};