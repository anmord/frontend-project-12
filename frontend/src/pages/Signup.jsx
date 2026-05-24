import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import { Header } from '../components/Header'
import { useTranslation } from 'react-i18next'

export const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" />
  }

  const schema = yup.object({
    username: yup
      .string()
      .required(t('errors.required'))
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax')),
    password: yup
      .string()
      .required(t('errors.required'))
      .min(6, t('errors.min')),
    confirmPassword: yup
      .string()
      .required(t('errors.required'))
      .oneOf([yup.ref('password')], t('errors.oneOf')),
  })

  return (
    <>
      <Header />
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axios.post('/api/v1/signup', {
              username: values.username,
              password: values.password,
            })
            const token = response.data.token
            localStorage.setItem('token', token)
            localStorage.setItem('username', response.data.username)
            navigate('/')
          }
          catch (err) {
            if (err.response?.status === 409) {
              setErrors({ username: t('errors.userExists') })
              console.log(err)
            }
            else {
              setErrors({ password: t('errors.network') })
            }
          }
          finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <h1>
                {t('signup')}
              </h1>
              <label htmlFor="username">
                {t('labelLogup')}
              </label>
              <Field
                id="username"
                type="text"
                name="username"
                className="form-control"
              />
              <ErrorMessage
                name="username"
                component="div"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                {t('labelPassword')}
              </label>
              <Field
                id="password"
                type="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage
                name="password"
                component="div"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                {t('form.confirmPassword')}
              </label>
              <Field
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {t('signupButton')}
            </button>
          </Form>
        )}
      </Formik>
    </>
  )
}
