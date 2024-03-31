import {Auth} from "../service/auth.js";
import {requests} from "../config.js";
import {CustomHttp} from "../service/custom-http.js";

export class Login {
    loginEmailElement = document.getElementById('login-email');
    loginPasswordElement = document.getElementById('login-password');
    rememberMeElement = document.getElementById('remember-me');

    constructor(openRout) {
        document.getElementById('login-process-btn').addEventListener('click', this.login.bind(this));
        this.openRout = openRout;
    }

    validateForm() {
        let isValid = true;
        if (this.loginEmailElement && this.loginEmailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.loginEmailElement.classList.remove('is-invalid');
        } else {
            this.loginEmailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.loginPasswordElement.value) {
            this.loginPasswordElement.classList.remove('is-invalid');
        } else {
            this.loginPasswordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async login() {
        if (this.validateForm()) {
            try {
                const result = await CustomHttp.requestPOST(requests.login, {
                    email: this.loginEmailElement.value,
                    password: this.loginPasswordElement.value
                });
                if (result) {//проверяем ответ от сервера
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.id) {
                        throw new Error(result.message);//генерируем ошибку
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo(result.user);
                    this.openRout('/');
                } else {
                    alert('Такой пользователь не зарегистрирован!');
                }
            } catch (error) {
                //можно вывести попап с деталями ошибки
                console.log(error);
            }
        }
    }
}