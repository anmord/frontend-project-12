import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import filter from '../utils/filter'

export const ChatWindow = ({ messages, channelId, username, token }) => {
  const { t } = useTranslation()
  const [newMessage, setNewMessage] = useState('')

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
      <ul>
        {messages.map(message => (
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
  )
}
