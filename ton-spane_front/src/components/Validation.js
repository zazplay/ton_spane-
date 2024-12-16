// валидация логина
export const validateLogin = (value) => {
    // Ограничение длины
    if (value.length > 20) {
        return {
            executionResult: false,
            messange: "Логин не должен превышать 20 символов."
        };
    }

    // Проверка на допустимые символы
    const loginRegex = /^[a-zA-Z0-9._]+$/;
    if (!loginRegex.test(value)) {
        return {
            executionResult: false,
            messange: "Логин может содержать только английские буквы, цифры, точки и символы '_'."
        };
    }

    // Проверка на начало и конец
    if (/^[._]/.test(value) || /[._]$/.test(value)) {
        return {
            executionResult: false,
            messange: "Логин не может начинаться или заканчиваться точкой или '_'.",
        };
    }

    return {
        executionResult: true,
        messange: "", // Если ошибок нет
    }; 
};

//валидация пароля
//   export const validatePassword = (value) => {
//     // Длина пароля от 8 до 16 символов
//     if (value.length < 8) {
//       return "Пароль должен быть не менее 8 символов.";
//     }
//     if (value.length > 16) {
//       return "Пароль не должен превышать 16 символов.";
//     }

//     // Минимум одна заглавная буква
//     if (!/[A-Z]/.test(value)) {
//       return "Пароль должен содержать минимум одну заглавную букву.";
//     }

//     // Минимум одна цифра
//     if (!/[0-9]/.test(value)) {
//       return "Пароль должен содержать минимум одну цифру.";
//     }

//     // Минимум один специальный символ
//     if (!/[!@#$%^&*()\-_+=]/.test(value)) {
//       return "Пароль должен содержать минимум один специальный символ (!@#$%^&*()-_=+).";
//     }

//     // Разрешенные символы
//     const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_+=]+$/;
//     if (!passwordRegex.test(value)) {
//       return "Пароль содержит недопустимые символы.";
//     }

//     return ""; // Если ошибок нет
//   };

//удаляет все лишнее из строки
export function stripping(value) {
    // Видаляємо всі символи, які не є літерами, пробілами, апострофами або тире
    value = value.replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'–-]/g, '');

    // Забороняємо два або більше апострофів підряд
    value = value.replace(/'{2,}/g, "'");

    // Забороняємо два або більше тире підряд
    value = value.replace(/-{2,}/g, "-");

    // Забороняємо апостроф або тире на початку та в кінці
    value = value.replace(/^['–-]+|['–-]+$/g, '');

    // Забороняємо пробіл на початку
    value = value.trimStart();

    // Забороняємо два пробіли підряд
    value = value.replace(/\s{2,}/g, ' ');

    // Перевіряємо довжину і обмежуємо її до 50 символів
    const truncatedValue = value.slice(0, 50);

    return truncatedValue;
}


const htmlTagRegex =
    /<\/?[a-z][\w-]*(?:\s+[a-z_:][\w:.-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*(?:\s\s+|=)*\s*\/?>|<!--[\s\S]*?-->/gi;// Регулярное выражение для HTML-тегов
const sqlInjectionRegex =
    /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|TRUNCATE|EXEC|UNION|OR|FROM|TABLE|AND)\b)|['"--;]/gi; // Регулярное выражение для SQL-инъекций

//удаляет все лишнее из строки для 
export function removeTagsOperators(value) {

    if (!value) return "";

    // Видалення HTML-тегів
    let sanitizedValue = value.replace(htmlTagRegex, "");

    // Видалення потенційно небезпечних SQL-операторів
    sanitizedValue = sanitizedValue.replace(sqlInjectionRegex, "");

    return sanitizedValue;
}

// Функция для проверки значения
export const validateInputToScript = (value) => {

    if (htmlTagRegex.test(value)) {
        return {
            executionResult: false,
            messange: "HTML-теги запрещены.",
        };
    }

    if (sqlInjectionRegex.test(value)) {
        return {
            executionResult: false,
            messange: "Введённое значение содержит запрещённые символы или слова.",
        };
    }

    return {
        executionResult: true,
        messange: "",
    };
};