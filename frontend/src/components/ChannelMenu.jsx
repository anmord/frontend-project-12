import { useTranslation } from 'react-i18next'

export const ChannelMenu = ({ channel, onClose, onRename, onDelete }) => {
  const { t } = useTranslation()

  if (!channel) {
    return null
  }

  return (
    <div
      className="card shadow-sm mt-2 w-100"
      onClick={onClose}
    >
      <div
        className="card-body d-grid gap-2"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="btn btn-outline-danger w-100"
          onClick={() => onDelete(channel)}
        >
          {t('chat.delete')}
        </button>
        <button
          className="btn btn-outline-primary w-100"
          onClick={() => onRename(channel)}
        >
          {t('chat.rename')}
        </button>
      </div>
    </div>
  )
}
