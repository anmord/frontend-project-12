import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useSelector } from 'react-redux'

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <h2
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        {t('appName')}
      </h2>
      {token && (
        <button
          type="button"
          onClick={handleLogout}
        >
          {t('logout')}
        </button>
      )}
    </div>
  )
}
