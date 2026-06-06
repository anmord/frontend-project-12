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
    <header className="border-bottom bg-white shadow-sm py-3 mb-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
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
    </header>
  )
}
