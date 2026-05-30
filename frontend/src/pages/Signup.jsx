import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { Header } from '../components/Header'
import { useTranslation } from 'react-i18next'

import { signup } from '../slices/authSlice'

export const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { token } = useSelector(state => state.auth)

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

  const handleSignupSubmit = async (values, { setSubmitting, setErrors }) => {
    const result = await dispatch(
      signup({
        username: values.username,
        password: values.password,
      }),
    )

    if (signup.fulfilled.match(result)) {
      navigate('/')
    }
    else {
      if (result.payload === 409) {
        setErrors({ username: t('errors.userExists') })
      }
      else {
        setErrors({ password: t('errors.network') })
      }
    }

    setSubmitting(false)
  }

  return (
    <>
      <Header />

      <Formik
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={schema}
        onSubmit={handleSignupSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            className="mx-auto mt-5 p-4 border rounded shadow"
            style={{ maxWidth: '400px' }}
          >
            <h1>{t('signup')}</h1>

            <div className="form-group">
              <label htmlFor="username">
                {t('labelLogup')}
              </label>

              <Field
                id="username"
                name="username"
                type="text"
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
                name="password"
                type="password"
                className="form-control"
              />

              <ErrorMessage name="password" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                {t('form.confirmPassword')}
              </label>

              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
              />

              <ErrorMessage name="confirmPassword" component="div" />
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
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
