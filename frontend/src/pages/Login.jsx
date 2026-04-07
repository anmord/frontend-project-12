import { Formik, Field, Form, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'

export const LoginPage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" />
  }
  return (
    <Formik
      initialValues={{ login: "", password: "" }}

      validate={(values) => {
        const errors = {}
        if (!values.login.trim()) {
          errors.login = 'Введите логин'
        }
        if (!values.password.trim()) {
          errors.password = 'Введите пароль'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const response = await axios.post('/api/v1/login', {
            username: values.login,
            password: values.password,
          })
          const token = response.data.token
          if (!token) {
            throw new Error('No token received')
          }
          localStorage.setItem('token', token)
          localStorage.setItem('username', response.data.username)
          navigate('/')
        } catch (err) {
          setErrors({ password: 'Невереный логин или пароль' })
          console.log(err)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {() => (
        <Form>
          <div className="form-group">
            <h1>Вход</h1>
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
          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate('/signup')}>Register</button>
        </Form>
      )}
    </Formik>
  )
};
