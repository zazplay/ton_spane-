// store.js
import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        user: {
            auth: false,
            token: null,
            sub: null, // Добавляем sub
        },
    },
    mutations: {
        auth_success(state, token) {
            state.user.auth = true;
            state.user.token = token;

            // Извлекаем sub из токена
            const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем JWT
            state.user.sub = payload.sub; // Получаем sub
        },
        logout(state) {
            state.user.auth = false;
            state.user.token = null;
            state.user.sub = null; // Очищаем sub
        },
    },
    actions: {
        initializeStore({ commit }) {
            const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
            if (token) {
                commit('auth_success', token); // Устанавливаем токен и извлекаем sub
            }
        },
        login({ commit }, token) {
            commit('auth_success', token); // Устанавливаем токен и извлекаем sub
            localStorage.setItem('authToken', token); // Сохраняем токен в localStorage
        },
        logout({ commit }) {
            commit('logout'); // Очищаем данные при выходе
            localStorage.removeItem('authToken'); // Удаляем токен из localStorage
        },
    },
    getters: {
        isAuthenticated: (state) => state.user.auth,
        getToken: (state) => state.user.token,
        getSub: (state) => state.user.sub, // Геттер для получения sub
    },
});