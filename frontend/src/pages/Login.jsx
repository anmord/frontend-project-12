import { Formik, Field, Form, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Header';

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" />
  }

  return (
    <>
      <Header />
      <Formik
        initialValues={{ login: "", password: "" }}

        validate={(values) => {
          const errors = {}
          if (!values.login.trim()) {
            errors.login = t('errors.login')
          }
          if (!values.password.trim()) {
            errors.password = t('errors.password')
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
            setErrors({ password: t('errors.authFailed') })
            console.log(err)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {() => (
          <Form>
            <div className="form-group">
              <h1>{t('login')}</h1>
              <label htmlFor="login">{t('labelLogin')}</label>
              <Field
                type="text"
                name="login"
                className="form-control"
              />
              <ErrorMessage name="login" component="div" />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('labelPassword')}</label>
              <Field
                type="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit">{t('login')}</button>
            <button type="button" onClick={() => navigate('/signup')}>{t('signup')}</button>
          </Form>
        )}
      </Formik>
    </>
  )
};
