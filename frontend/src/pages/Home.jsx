import { Navigate } from 'react-router-dom'
import { ChannelMenu } from '../components/ChannelMenu'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { toast } from 'react-toastify'
import { ChatWindow } from '../components/ChatWindow'
import { AddChannelModal } from '../components/modals/AddChannelModal'
import { RenameChannelModal } from '../components/modals/RenameChannelModal'
import { useChatSocket } from '../hooks/useChatSocket'
import { DeleteChannelModal } from '../components/modals/DeleteChannelModal'
import { ChannelsList } from '../components/ChannelsList'
import { useSelector } from 'react-redux'

export const HomePage = () => {
  const { t } = useTranslation()

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

  const [activeChannel, setActiveChannel] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToRename, setChannelToRename] = useState(null)
  const [channelMenu, setChannelMenu] = useState(null)

  useChatSocket(token)

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

  if (
    (channelsLoading || messagesLoading)
    && channels.length === 0
  ) return (
    <div>
      {t('common.loading')}
    </div>
  )

  const handleMenuToggle = (channel) => {
    setChannelMenu(current =>
      current?.id === channel.id
        ? null
        : channel
    )
  }

  const currentMessages = messages.filter(
    m => String(m.channelId) === String(activeChannel),
  )

  return (
    <>
      <Header />
      <div className="container-fluid overflow-hidden">
        <h1>
          {t('homePage')}
        </h1>
        <p>
          {t('username', { name: username })}
        </p>
        <div className="row g-4 align-items-stretch">
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
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
                <ChannelsList
                  channels={channels}
                  activeChannel={activeChannel}
                  onSelectChannel={setActiveChannel}
                  onOpenMenu={handleMenuToggle}
                />
                <ChannelMenu
                  channel={channelMenu}
                  onClose={() => setChannelMenu(null)}
                  onRename={(channel) => {
                    setChannelToRename(channel)
                    setChannelMenu(null)
                  }}
                  onDelete={(channel) => {
                    setChannelToDelete(channel)
                    setChannelMenu(null)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <ChatWindow
                  messages={currentMessages}
                  channelId={activeChannel}
                  username={username}
                  token={token}
                />
              </div>
            </div>
          </div>
          <AddChannelModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onCreated={channel => setActiveChannel(channel.id)}
          />
          <RenameChannelModal
            channel={channelToRename}
            onClose={() => setChannelToRename(null)}
          />
          <DeleteChannelModal
            channel={channelToDelete}
            onClose={() => setChannelToDelete(null)}
          />
        </div>
      </div>
    </>
  )
}
