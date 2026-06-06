import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { renameChannel } from '../../slices/channelsSlice'
import filter from '../../utils/filter'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

export const RenameChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const channels = useSelector(state => state.channels.channels)

  const schema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax'))
      .test('unique', t('errors.unique'), (value) => {
        if (!value) return true

        return !channels.some(
          c =>
            c.name.toLowerCase() === value.toLowerCase()
            && c.id !== channel.id,
        )
      }),
  })

  if (!channel) {
    return null
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      onClick={onClose}
    >
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values) => {
          dispatch(renameChannel({
            id: channel.id,
            name: filter.clean(values.name),
          }))
            .unwrap()
            .then(() => {
              toast.success(t('toast.channelRenamed'))
              onClose()
            })
            .catch(() => toast.error(t('toast.networkError')))
        }}
      >
        <Form>
          <div
            className="bg-white p-4 mx-auto mt-5 rounded shadow"
            style={{ width: '100%', maxWidth: '400px' }}
            onClick={e => e.stopPropagation()}
          >
            <h1>
              {t('chat.rename')}
            </h1>
            <label htmlFor="renameChannel">
              {t('chat.channelName')}
            </label>
            <Field
              id="renameChannel"
              aria-label={t('chat.channelName')}
              name="name"
              type="text"
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
                onClick={onClose}
              >
                {t('chat.cancel')}
              </button>
              <button type="submit">
                {t('save')}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
