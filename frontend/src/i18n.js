import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      appName: 'Hexlet Chat',
      login: 'Вход',
      signup: 'Регистрация',
      signupButton: 'Зарегистрироваться',
      logout: 'Выйти',
      homePage: 'Домашняя страница',
      username: 'Ник: {{name}}',
      save: 'Сохранить',
      labelLogup: 'Имя пользователя',
      labelLogin: 'Ваш ник',
      labelPassword: 'Пароль',

      form: {
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        submit: 'Отправить',
      },

      errors: {
        required: 'Обязательное поле',
        userExists: 'Такой пользователь уже существует',
        authFailed: 'Неверные имя пользователя или пароль',
        minMax: 'От 3 до 20 символов',
        min: 'Не менее 6 символов',
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
        channelName: 'Имя канала',
        newChannel: 'Новый канал',
        rename: 'Переименовать канал',
        delete: 'Удалить',
        send: 'Отправить',
        messagePlaceholder: 'Новое сообщение',
        cancel: 'Отмена',
        add: 'Добавить',
        confirmDeletion: 'Подтвердите удаление',
      },

      common: {
        loading: 'Выполняется загрузка, пожалуйста подождите',
        loadingChannel: 'Загрузка канала...',
        error: 'Ошибка: {{message}}',
      },

      toast: {
        networkError: 'Ошибка сети',
        loadError: 'Ошибка загрузки данных',
        channelCreated: 'Канал создан',
        channelRemoved: 'Канал удален',
        channelRenamed: 'Канал переименован',
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