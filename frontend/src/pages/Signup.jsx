import { Formik, Field, Form, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
import * as yup from 'yup'

export const SignupPage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const schema = yup.object({
    login: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 символов')
      .max(20, 'До 20 символов'),
    password: yup
      .string()
      .required('Обязательное поле')
      .min(6, 'От 6 символов'),
    confirmPassword: yup
      .string()
      .required('Обязательное поле')
      .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Hexlet Chat
        </h2>
        {token && (
          <button onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
      <Formik
        initialValues={{ login: "", password: "", confirmPassword: "" }}
        validationSchema={schema}
        validateOnMount
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axios.post('/api/v1/signup', {
              username: values.login,
              password: values.password,
            })
            const token = response.data.token
            localStorage.setItem('token', token)
            localStorage.setItem('username', response.data.username)
            navigate('/')
          } catch (err) {
            if (err.response?.status === 409) {
              setErrors({ login: 'Пользователь уже существует' })
              console.log(err)
            } else {
              setErrors({ password: 'Ошибка сети или сервера' })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div className="form-group">
              <h1>Регистрация</h1>
              <label htmlFor="login">Login</label>
              <Field
                type="text"
                name="login"
                className="form-control"
              />
              <ErrorMessage name="login" component="div" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting || !isValid}>Submit</button>
            <button type="button" onClick={() => navigate('/login')}>Signin</button>
          </Form>
        )}
      </Formik>
    </>
  )
};