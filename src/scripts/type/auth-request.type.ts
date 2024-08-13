//тип для авторизации и регистрации нового пользователя(отправка данных)
export type AuthRequestType = {
    name?: string,
    lastName?: string,
    email: string,
    password: string,
    passwordRepeat?: string,
    rememberMe?: boolean
}