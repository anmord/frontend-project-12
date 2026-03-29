import { Navigate, useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <h1>Домашняя страница</h1>
      <button type="submit" onClick={handleLogout}>Back</button>
    </div>
  )
};