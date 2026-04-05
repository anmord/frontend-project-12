import { NotFoundPage } from './pages/NotFound.jsx'
import { LoginPage } from './pages/Login.jsx'
import { HomePage } from './pages/Home.jsx'
import { SignupPage } from './pages/Signup.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
