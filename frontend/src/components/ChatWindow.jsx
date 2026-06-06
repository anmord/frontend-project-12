import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import filter from '../utils/filter'

export const ChatWindow = ({ messages, channelId, username, token }) => {
  const { t } = useTranslation()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  const handleSendMessage = async () => {
    try {
      const cleanedMessage = filter.clean(newMessage)
      await axios.post('/api/v1/messages', {
        body: cleanedMessage,
        channelId,
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
  return (
    <div className="flex-grow-1">
      <h2>
        {t('chat.chat')}
      </h2>
      <div
        className="border rounded p-3 mb-3 bg-light"
        style={{
          height: '60vh',
          overflowY: 'auto',
        }}
      >
        <ul className="list-unstyled mb-0">
          {messages.map(message => (
            <li key={message.id} className="mb-2">
              <b>
                {message.username}
                :
              </b>
              {' '}
              {message.body}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="d-flex gap-2">
        <input
          className="form-control flex-grow-1"
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
  )
}
