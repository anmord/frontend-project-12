import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { createChannel } from '../../slices/channelsSlice'
import filter from '../../utils/filter'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

export const AddChannelModal = ({ isOpen, onClose, onCreated }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(state => state.channels.channels)

  const schema = yup.object({
    name: yup
      .string()
      .required(t('errors.required'))
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax'))
      .test('unique', t('errors.unique'), (value) => {
        if (!value) return true

        return !channels.some(
          c => c.name.toLowerCase() === value.toLowerCase(),
        )
      }),
  })

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      onClick={onClose}
    >
      <Formik
        enableReinitialize
        initialValues={{ name: '' }}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values) => {
          const cleaned = filter.clean(values.name)
          dispatch(createChannel({ name: cleaned }))
            .unwrap()
            .then((channel) => {
              toast.success(t('toast.channelCreated'))
              onCreated(channel)
              onClose()
            })
            .catch(() => toast.error(t('toast.networkError')))
        }}
      >
        {({ resetForm }) => (
          <Form>
            <div
              className="bg-white p-4 mx-auto mt-5 rounded shadow"
              style={{ width: '100%', maxWidth: '400px' }}
              onClick={e => e.stopPropagation()}
            >
              <h1>
                {t('chat.newChannel')}
              </h1>
              <label htmlFor="channelName">
                {t('chat.channelName')}
              </label>
              <Field
                id="channelName"
                aria-label={t('chat.channelName')}
                type="text"
                name="name"
                className="form-control"
                autoFocus
              />
              <ErrorMessage
                name="name"
                component="div"
              />
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    onClose()
                  }}
                >
                  {t('chat.cancel')}
                </button>
                <button type="submit">
                  {t('chat.add')}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
