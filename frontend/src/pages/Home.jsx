import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages, createChannel, addMessage, addChannel, removeChannel, renameChannel, updateChannel } from '../slices/chatSlice';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from 'yup'

export const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { channels, messages, loading, error } = useSelector(state => state.chat)
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const [newMessage, setNewMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToRename, setChannelToRename] = useState(null)

  const schema = yup.object({
    name: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 символов')
      .max(20, 'До 20 символов')
      .test('unique', 'Канал уже существует', function (value) {
        if (!value) return true
        const isDuplicate = channels.some(
          c => c.name.toLowerCase() === value.toLowerCase()
            && c.id !== channelToRename?.id
        )
        if (isDuplicate) {
          return this.createError({ message: 'Канал уже существует' })
        }
        return true
      })
  })

  if (!token) return <Navigate to="/login" />

  useEffect(() => {
    const socket = io('https://frontend-project-12-5cf7.onrender.com', {
      auth: { token }
    })

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel))
      setActiveChannel(channel.id)
    })

    socket.on('renameChannel', (channel) => {
      dispatch(updateChannel(channel))
    })

    dispatch(fetchChannels())
    dispatch(fetchMessages())

    return () => {
      socket.off('newMessage')
      socket.off('newChannel')
      socket.off('renameChannel')
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
    localStorage.removeItem('username')
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
      <div><a>Ник: {username}</a></div>
      <button type="button" onClick={handleLogout}>Back</button>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

        <div style={{ width: '200px' }}>
          <h2>Каналы</h2>
          <button type="button" onClick={() => setModalOpen(true)}> + NewChannel</button>

          {isModalOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)'
              }}
              onClick={() => setModalOpen(false)}
            >
              <Formik
                enableReinitialize
                initialValues={{ name: "" }}
                validationSchema={schema}
                onSubmit={(values) => {
                  dispatch(createChannel({ name: values.name }))
                  setModalOpen(false)
                }}
              >
                {({ resetForm }) => (
                  <Form>
                    <div
                      style={{
                        background: 'white',
                        padding: '20px',
                        margin: '100px auto',
                        width: '300px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h1>Новый канал</h1>
                      <label htmlFor="name">Имя</label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        autoFocus
                      />
                      <ErrorMessage name="name" component="div" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            resetForm()
                            setModalOpen(false)
                          }}
                        >
                          Отмена
                        </button>
                        <button type="submit">Добавить</button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          <div>
            {channels.map(channel => (
              <div key={channel.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  onClick={() => setActiveChannel(channel.id)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: channel.id === activeChannel ? 'bold' : 'normal'
                  }}
                >
                  # {channel.name}
                </span>

                {channel.removable && (
                  <button onClick={() => setChannelToDelete(channel)}>⋮</button>
                )}
              </div>
            ))}
          </div>

          {channelToDelete && (
            <div onClick={() => setChannelToDelete(null)}>
              <div onClick={(e) => e.stopPropagation()}>
                <p>Подтвердите удаление канала</p>
                <button onClick={() => setChannelToDelete(null)}>Отмена</button>
                <button onClick={() => {
                  const deleteId = channelToDelete.id
                  dispatch(removeChannel(deleteId))
                  if (deleteId === activeChannel) {
                    const remaining = channels.filter(c => c.id !== deleteId)
                    setActiveChannel(remaining[0]?.id || null)
                  }
                  setChannelToDelete(null)
                }}>Удалить</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Чат</h2>
          <ul>
            {messages.filter(m => m.channelId === activeChannel).map(message => (
              <li key={message.id}>
                <b>{message.username}:</b> {message.body}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение"
            />
            <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              Отправить
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}