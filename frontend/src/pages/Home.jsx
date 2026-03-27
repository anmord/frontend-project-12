import { Navigate } from "react-router-dom";

export const HomePage = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" />
  }
  return <h1>Домашняя страница</h1>
};