import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages, createChannel, addMessage, addChannel, removeChannel, renameChannel, updateChannel } from '../slices/chatSlice';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from 'yup'
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';
import { toast } from 'react-toastify'
import filter from '../utils/filter'
import { useRollbar } from '@rollbar/react'

export const HomePage = () => {
  const { t } = useTranslation()
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
  const [channelMenu, setChannelMenu] = useState(null)
  const rollbar = useRollbar()

  const schema = yup.object({
    name: yup
      .string()
      .required(t('errors.required'))
      .min(3, t('errors.min', { count: 3 }))
      .max(20, t('errors.max', { count: 20 }))
      .test('unique', t('errors.unique'), function (value) {
        if (!value) return true
        const isDuplicate = channels.some(
          c => c.name.toLowerCase() === value.toLowerCase()
            && c.id !== channelToRename?.id
        )
        if (isDuplicate) {
          return this.createError({ message: t('errors.unique') })
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
    if (!channels.find(c => c.id === activeChannel)) {
      setActiveChannel(channels[0]?.id || null)
    }
  }, [channels, activeChannel])

  useEffect(() => {
    if (error) {
      toast.error(t('toast.loadError'))
    }
  }, [error, t])

  const handleSendMessage = async () => {
    try {
      const cleanedMessage = filter.clean(newMessage)

      await axios.post('/api/v1/messages', {
        body: cleanedMessage,
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
      toast.error(t('toast.networkError'))
    }
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)'
  }

  const modalStyle = {
    background: 'white',
    padding: '20px',
    margin: '100px auto',
    width: '300px'
  }

  if (loading) return <div>{t('common.loading')}</div>
  if (!activeChannel) return <div>{t('common.loadingChannel')}</div>
  console.log(import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN)
  return (
    <>
      <Header />
      <div>
        <h1>{t('homePage')}</h1>
        <div><a>{t('username', { name: username })}</a></div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

          <div style={{ width: '200px' }}>
            <h2>{t('chat.channels')}</h2>
            <button onClick={() => rollbar.error('Test error')}>
              Test error
            </button>
            <button type="button" onClick={() => setModalOpen(true)}> + {t('chat.newChannel')}</button>

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
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    const cleanedName = filter.clean(values.name)

                    dispatch(createChannel({ name: cleanedName }))
                      .unwrap()
                      .then(() => {
                        toast.success(t('toast.channelCreated'))
                        setModalOpen(false)
                      })
                      .catch(() => toast.error(t('toast.networkError')))
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
                        <h1>{t('chat.newChannel')}</h1>
                        <label htmlFor="name">{t('chat.channelName')}</label>
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
                            {t('chat.cancel')}
                          </button>
                          <button type="submit">{t('chat.add')}</button>
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
                    <button onClick={() => setChannelMenu(channel)}>⋮</button>
                  )}
                </div>
              ))}
            </div>
            {channelMenu && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                onClick={() => setChannelMenu(null)}>
                <div
                  style={{
                    position: 'absolute',
                    top: '100px',
                    left: '100px',
                    background: 'white',
                    padding: '10px',
                    border: '1px solid #ccc'
                  }}
                  onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => {
                    setChannelToDelete(channelMenu)
                    setChannelMenu(null)
                  }}>
                    {t('chat.delete')}
                  </button>
                  <button onClick={() => {
                    setChannelToRename(channelMenu)
                    setChannelMenu(null)
                  }}>
                    {t('chat.rename')}
                  </button>
                </div>
              </div>
            )}
            {channelToDelete && (
              <div
                style={overlayStyle}
                onClick={() => setChannelToDelete(null)}
              >
                <div
                  style={modalStyle}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>{t('chat.confirmDeletion')}</p>

                  <button onClick={() => setChannelToDelete(null)}>
                    {t('chat.cancel')}
                  </button>

                  <button onClick={() => {
                    dispatch(removeChannel(channelToDelete.id))
                      .unwrap()
                      .then(() => toast.success(t('toast.channelRemoved')))
                      .catch(() => toast.error(t('toast.networkError')))
                    setChannelToDelete(null)
                  }}>
                    {t('chat.delete')}
                  </button>
                </div>
              </div>
            )}
            {channelToRename && (
              <div
                style={overlayStyle}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setChannelToRename(null)
                  }
                }}
              >
                <Formik
                  initialValues={{ name: channelToRename.name }}
                  validationSchema={schema}
                  onSubmit={(values) => {
                    const cleanedName = filter.clean(values.name)

                    dispatch(renameChannel({
                      id: channelToRename.id,
                      name: cleanedName
                    }))
                      .unwrap()
                      .then(() => toast.success(t('toast.channelRenamed')))
                      .catch(() => toast.error(t('toast.networkError')))
                    setChannelToRename(null)
                  }}
                >
                  <Form>
                    <div style={modalStyle}>
                      <h1>{t('chat.rename')}</h1>

                      <Field name="name" autoFocus />
                      <ErrorMessage name="name" component="div" />

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setChannelToRename(null)
                          }}
                        >
                          {t('chat.cancel')}
                        </button>
                        <button type="submit">{t('save')}</button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h2>{t('chat.chat')}</h2>
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
                placeholder={t('chat.messagePlaceholder')}
              />
              <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                {t('form.submit')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}