import { Formik, Field, Form, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
import * as yup from 'yup'
import { Header } from '../components/Header';
import { useTranslation } from 'react-i18next';

export const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" />
  }

  const schema = yup.object({
    login: yup
      .string()
      .required(t('errors.required'))
      .min(3, t('errors.min', { count: 3 }))
      .max(20, t('errors.max', { count: 20 })),
    password: yup
      .string()
      .required(t('errors.required'))
      .min(6, t('errors.min', { count: 6 })),
    confirmPassword: yup
      .string()
      .required(t('errors.required'))
      .oneOf([yup.ref('password')], t('errors.oneOf')),
  })

  return (
    <>
      <Header />
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
              setErrors({ login: t('errors.userExists') })
              console.log(err)
            } else {
              setErrors({ password: t('errors.network') })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div className="form-group">
              <h1>{t('signup')}</h1>
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
            <div className="form-group">
              <label htmlFor="confirmPassword">{t('form.confirmPassword')}</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting || !isValid}>{t('signup')}</button>
            <button type="button" onClick={() => navigate('/login')}>{t('login')}</button>
          </Form>
        )}
      </Formik>
    </>
  )
};