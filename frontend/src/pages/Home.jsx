import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addChannel,
  updateChannel,
  deleteChannel,
  fetchChannels,
  createChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice'
import { addMessage, fetchMessages } from '../slices/messagesSlice'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { toast } from 'react-toastify'
import filter from '../utils/filter'

export const HomePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
  } = useSelector(state => state.channels)
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
  } = useSelector(state => state.messages)
  const { token, username } = useSelector(state => state.auth)
  const [newMessage, setNewMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToRename, setChannelToRename] = useState(null)
  const [channelMenu, setChannelMenu] = useState(null)

  const schema = yup.object({
    name: yup
      .string()
      .required(t('errors.required'))
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax'))
      .test('unique', t('errors.unique'), function (value) {
        if (!value) return true
        const isDuplicate = channels.some(
          c => c.name.toLowerCase() === value.toLowerCase()
            && c.id !== channelToRename?.id,
        )
        if (isDuplicate) {
          return this.createError({ message: t('errors.unique') })
        }
        return true
      }),
  })

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

  useEffect(() => {
    if (!channels.find(c => c.id === activeChannel)) {
      setActiveChannel(channels[0]?.id || null)
    }
  }, [channels, activeChannel])

  useEffect(() => {
    if (channelsError || messagesError) {
      toast.error(t('toast.loadError'))
    }
  }, [channelsError, messagesError, t])

  if (!token) return <Navigate to="/login" />

  const handleSendMessage = async () => {
    try {
      const cleanedMessage = filter.clean(newMessage)

      await axios.post('/api/v1/messages', {
        body: cleanedMessage,
        channelId: activeChannel,
        username,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setNewMessage('')
    }
    catch (err) {
      console.error(err)
      toast.error(t('toast.networkError'))
    }
  }

  if (
    (channelsLoading || messagesLoading)
    && channels.length === 0
  ) return (
    <div>
      {t('common.loading')}
    </div>
  )

  const currentMessages = messages.filter(
    m => String(m.channelId) === String(activeChannel),
  )

  return (
    <>
      <Header />
      <div>
        <h1>
          {t('homePage')}
        </h1>
        <div>
          <p>
            {t('username', { name: username })}
          </p>
        </div>

        <div className="d-flex gap-4 mt-4">
          <div className="col-3">
            <h2>
              {t('chat.channels')}
            </h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              {' '}
              +
              {t('chat.newChannel')}
            </button>
            {isModalOpen && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                onClick={() => setModalOpen(false)}
              >
                <Formik
                  enableReinitialize
                  initialValues={{ name: '' }}
                  validationSchema={schema}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    const cleaned = filter.clean(values.name)
                    dispatch(createChannel({ name: cleaned }))
                      .unwrap()
                      .then((channel) => {
                        setActiveChannel(channel.id)
                        toast.success(t('toast.channelCreated'))
                        setModalOpen(false)
                      })
                      .catch(() => toast.error(t('toast.networkError')))
                  }}
                >
                  {({ resetForm }) => (
                    <Form>
                      <div
                        className="bg-white p-4 mx-auto mt-5 rounded shadow"
                        style={{ width: '100%', maxWidth: '400px' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <h1>
                          {t('chat.newChannel')}
                        </h1>
                        <label htmlFor="channelName">
                          {t('chat.channelName')}
                        </label>
                        <Field
                          id="channelName"
                          aria-label={t('chat.channelName')}
                          type="text"
                          name="name"
                          className="form-control"
                          autoFocus
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                        />
                        <div className="d-flex justify-content-between mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              resetForm()
                              setModalOpen(false)
                            }}
                          >
                            {t('chat.cancel')}
                          </button>
                          <button type="submit">
                            {t('chat.add')}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            <div>
              {channels.map(channel => (
                <div
                  key={channel.id}
                  className="d-flex justify-content-between position-relative"
                >
                  <button
                    type="button"
                    onClick={() => setActiveChannel(channel.id)}
                    className={`btn w-100 text-start ${channel.id === activeChannel
                      ? 'btn-secondary'
                      : 'btn-light'
                    }`}
                  >
                    <span>
                      #
                      {' '}
                    </span>
                    <span>
                      {channel.name}
                    </span>
                  </button>
                  {channel.removable && (
                    <button
                      type="button"
                      onClick={() => setChannelMenu(channel)}
                    >
                      <span className="visually-hidden">
                        {t('chat.manageChannel')}
                      </span>
                      ⋮
                    </button>
                  )}
                </div>
              ))}
            </div>
            {channelMenu && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 1040 }}
                onClick={() => setChannelMenu(null)}
              >
                <div
                  className="position-absolute bg-white p-2 border rounded shadow"
                  style={{
                    top: '120px',
                    left: '220px',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => {
                    setChannelToDelete(channelMenu)
                    setChannelMenu(null)
                  }}
                  >
                    {t('chat.delete')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChannelToRename(channelMenu)
                      setChannelMenu(null)
                    }}
                  >
                    {t('chat.rename')}
                  </button>
                </div>
              </div>
            )}
            {channelToDelete && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                onClick={() => setChannelToDelete(null)}
              >
                <div
                  className="bg-white p-4 mx-auto mt-5 rounded shadow"
                  style={{ width: '100%', maxWidth: '400px' }}
                  onClick={e => e.stopPropagation()}
                >
                  <p>
                    {t('chat.confirmDeletion')}
                  </p>
                  <button onClick={() => setChannelToDelete(null)}>
                    {t('chat.cancel')}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      dispatch(removeChannel(channelToDelete.id))
                        .unwrap()
                        .then(() => toast.success(t('toast.channelRemoved')))
                        .catch(() => toast.error(t('toast.networkError')))
                      setChannelToDelete(null)
                    }}
                  >
                    {t('chat.delete')}
                  </button>
                </div>
              </div>
            )}
            {channelToRename && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setChannelToRename(null)
                  }
                }}
              >
                <Formik
                  initialValues={{ name: channelToRename.name }}
                  validationSchema={schema}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    dispatch(renameChannel({
                      id: channelToRename.id,
                      name: filter.clean(values.name),
                    }))
                      .unwrap()
                      .then(() => {
                        toast.success(t('toast.channelRenamed'))
                        setChannelToRename(null)
                      })
                      .catch(() => toast.error(t('toast.networkError')))
                  }}
                >
                  <Form>
                    <div
                      className="bg-white p-4 mx-auto mt-5 rounded shadow"
                      style={{ width: '100%', maxWidth: '400px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <h1>
                        {t('chat.rename')}
                      </h1>
                      <label htmlFor="renameChannel">
                        {t('chat.channelName')}
                      </label>
                      <Field
                        id="renameChannel"
                        aria-label={t('chat.channelName')}
                        name="name"
                        type="text"
                        className="form-control"
                        autoFocus
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                      />
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setChannelToRename(null)
                          }}
                        >
                          {t('chat.cancel')}
                        </button>
                        <button type="submit">
                          {t('save')}
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <h2>
              {t('chat.chat')}
            </h2>
            <ul>
              {currentMessages.map(message => (
                <li key={message.id}>
                  <b>
                    {message.username}
                    :
                  </b>
                  {' '}
                  {message.body}
                </li>
              ))}
            </ul>
            <div className="mt-4 d-flex gap-2">
              <input
                className="form-control w-auto flex-grow-1"
                type="text"
                value={newMessage}
                aria-label={t('chat.messagePlaceholder')}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    handleSendMessage()
                  }
                }}
                placeholder={t('chat.messagePlaceholder')}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                {t('form.submit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
