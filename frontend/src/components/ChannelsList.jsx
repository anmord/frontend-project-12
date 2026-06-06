import { useTranslation } from 'react-i18next'

export const ChannelsList = ({ channels, activeChannel, onSelectChannel, onOpenMenu }) => {
  const { t } = useTranslation()

  return (
    <div>
      {channels.map(channel => (
        <div
          key={channel.id}
          className="d-flex justify-content-between position-relative"
        >
          <button
            type="button"
            onClick={() => onSelectChannel(channel.id)}
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
              onClick={() => onOpenMenu(channel)}
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
  )
}
