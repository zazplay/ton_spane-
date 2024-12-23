import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    profile: {
      goToProfile: "Go to Profile >",
      loading: "Loading..."
    },
    logout: {
      buttonText: "Sign Out",
      dialogTitle: "Confirm Sign Out",
      dialogMessage: "Are you sure you want to sign out?",
      cancelButton: "Cancel",
      confirmButton: "Sign Out",
      errorMessage: "Error occurred during sign out"
    },
    more: {
      title: "More",
      language: {
        en: "English",
        ru: "Russian"
      }
    }
  },
  ru: {
    profile: {
      goToProfile: "Перейти к профилю >",
      loading: "Загрузка..."
    },
    logout: {
      buttonText: "Выйти из профиля",
      dialogTitle: "Подтверждение выхода",
      dialogMessage: "Вы действительно хотите выйти?",
      cancelButton: "Отмена",
      confirmButton: "Выйти",
      errorMessage: "Произошла ошибка при выходе"
    },
    more: {
      title: "Еще",
      language: {
        en: "English",
        ru: "Русский"
      }
    }
  }
}

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'ru', // Используем сохранённый язык или русский по умолчанию
  fallbackLocale: 'en',
  messages
})