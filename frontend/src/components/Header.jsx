import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        {t('appName')}
      </h2>
      {token && (
        <button type="button" onClick={handleLogout}>{t('logout')}</button>
      )}
    </div>
  )
}