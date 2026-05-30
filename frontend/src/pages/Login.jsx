import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/Header'
import { toast } from 'react-toastify'
import { useRollbar } from '@rollbar/react'

import { login } from '../slices/authSlice'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rollbar = useRollbar()

  const { token } = useSelector(state => state.auth)

  if (token) {
    return <Navigate to="/" />
  }

  const validationSchema = yup.object({
    username: yup.string().required(t('errors.login')),
    password: yup.string().required(t('errors.password')),
  })

  const handleLoginSubmit = async (values, formikHelpers) => {
    const { setSubmitting, setErrors } = formikHelpers

    const result = await dispatch(login(values))

    if (login.fulfilled.match(result)) {
      navigate('/')
    }
    else {
      if (result.payload === 401) {
        setErrors({ password: t('errors.authFailed') })
      }
      else {
        toast.error(t('toast.networkError'))
        rollbar.error(result.payload)
      }
    }

    setSubmitting(false)
  }

  return (
    <>
      <Header />

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLoginSubmit}
      >
        {() => (
          <Form
            className="mx-auto mt-5 p-4 border rounded shadow"
            style={{ maxWidth: '400px' }}
          >
            <h1>{t('login')}</h1>

            <div className="form-group">
              <label htmlFor="username">
                {t('labelLogin')}
              </label>

              <Field
                id="username"
                type="text"
                name="username"
                className="form-control"
              />

              <ErrorMessage name="username" component="div" />
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

              <ErrorMessage name="password" component="div" />
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              type="submit"
            >
              {t('login')}
            </button>

            <Link to="/signup">
              {t('signup')}
            </Link>
          </Form>
        )}
      </Formik>
    </>
  )
}
