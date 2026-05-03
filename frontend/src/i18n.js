import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      appName: 'Hexlet Chat',
      login: 'Вход',
      signup: 'Регистрация',
      logout: 'Выйти',
      homePage: 'Домашняя страница',
      username: 'Ник: {{name}}',
      save: 'Сохранить',
      labelLogin: 'Логин',
      labelPassword: 'Пароль',

      form: {
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтверждение пароля',
        submit: 'Отправить',
      },

      errors: {
        required: 'Обязательное поле',
        userExists: 'Пользователь уже существует',
        authFailed: 'Неверный логин или пароль',
        min: 'От {{count}} символов',
        max: 'До {{count}} символов',
        unique: 'Канал уже существует',
        network: 'Ошибка сети',
        login: 'Введите логин',
        password: 'Введите пароль',
        pnf: 'Страница не найдена',
        oneOf: 'Пароли должны совпадать'
      },

      chat: {
        channels: 'Каналы',
        chat: 'Чат',
        channelName: 'Имя',
        newChannel: 'Новый канал',
        rename: 'Переименовать канал',
        delete: 'Удалить',
        send: 'Отправить',
        messagePlaceholder: 'Введите сообщение',
        cancel: 'Отмена',
        add: 'Добавить',
        confirmDeletion: 'Подтвердите удаление',
      },

      common: {
        loading: 'Выполняется загрузка, пожалуйста подождите',
        loadingChannel: 'Загрузка канала...',
        error: 'Ошибка: {{message}}',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n  