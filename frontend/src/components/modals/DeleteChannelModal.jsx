import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { removeChannel } from '../../slices/channelsSlice'

export const DeleteChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  if (!channel) {
    return null
  }

  const handleDelete = () => {
    dispatch(removeChannel(channel.id))
      .unwrap()
      .then(() => {
        toast.success(t('toast.channelRemoved'))
        onClose()
      })
      .catch(() => toast.error(t('toast.networkError')))
  }
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 mx-auto mt-5 rounded shadow"
        style={{ width: '100%', maxWidth: '400px' }}
        onClick={e => e.stopPropagation()}
      >
        <p>
          {t('chat.confirmDeletion')}
        </p>
        <button onClick={onClose}>
          {t('chat.cancel')}
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
        >
          {t('chat.delete')}
        </button>
      </div>
    </div>
  )
}
