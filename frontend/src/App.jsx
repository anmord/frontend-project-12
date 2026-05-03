import { NotFoundPage } from './pages/NotFound.jsx'
import { LoginPage } from './pages/Login.jsx'
import { HomePage } from './pages/Home.jsx'
import { SignupPage } from './pages/Signup.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        <ToastContainer />
      </>
    </BrowserRouter>
  )
}

export default App
