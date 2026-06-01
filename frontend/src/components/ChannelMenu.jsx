import { useTranslation } from 'react-i18next'

export const ChannelMenu = ({ channel, onClose, onRename, onDelete }) => {
  const { t } = useTranslation()

  if (!channel) {
    return null
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      onClick={onClose}
    >
      <div
        className="position-absolute bg-white p-2 border rounded shadow"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onDelete(channel)}
        >
          {t('chat.delete')}
        </button>
        <button
          onClick={() => onRename(channel)}
        >
          {t('chat.rename')}
        </button>
      </div>
    </div>
  )
}
