import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";
import {ProcessFullNameUtils} from "../utils/processFullName-utils.js";

export class Auth {
    commonErrorElement = document.getElementById('common-error');
    emailElement = document.getElementById('email');
    passwordElement = document.getElementById('password');
    rememberMeElement = null;

    fullNameElement = null;
    repeatPasswordElement = null;

    constructor(page, openRout) {
        this.page = page;
        this.openRout = openRout;
        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('remember-me');
        } else if (this.page === 'signup') {
            this.fullNameElement = document.getElementById('full-name');
            this.repeatPasswordElement = document.getElementById('repeat-password');
        }
        this.rememberMeElement = document.getElementById('remember-me');
        document.getElementById('process-btn').addEventListener('click', this.processAuth.bind(this));
    }

    validateForm() {
        let isValid = true;
        if (this.emailElement && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.page === 'signup') {
            if (this.fullNameElement.value && this.fullNameElement.value.match(/^[аА-яЯ]+\s[аА-яЯ]+\s?[аА-яЯ]*$/)) {
                this.fullNameElement.classList.remove('is-invalid');
            } else {
                this.fullNameElement.classList.add('is-invalid');
                isValid = false;
            }
            if (this.repeatPasswordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) && this.repeatPasswordElement.value === this.passwordElement.value) {
                this.repeatPasswordElement.classList.remove('is-invalid');
            } else {
                this.repeatPasswordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    async processAuth() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const emailValue = this.emailElement.value;
            const passwordValue = this.passwordElement.value;
            if (this.page === "signup") {
                //запрос на создание нового пользователя
                const result = await HttpUtils.request("/signup", "POST",false,{
                    name: ProcessFullNameUtils.separation(this.fullNameElement.value).name,
                    lastName: ProcessFullNameUtils.separation(this.fullNameElement.value).lastName,
                    email: emailValue,
                    password: passwordValue,
                    passwordRepeat: this.repeatPasswordElement.value
                });
                if (result) {
                    if (result.error || !result.response || (result.response && (!result.response.user || !result.response.user.id))) {
                        if (result.response.message) {
                            this.commonErrorElement.style.display = 'block';
                            this.commonErrorElement.innerText = result.response.message;
                        }
                        return;
                    }
                }
            }

            //этот запрос происходит при авторизации и сразу после регистрации(если при авторизации не было ошибки)
            const result = await HttpUtils.request('/login', 'POST', false, {
                email: emailValue,
                password: passwordValue
            });

            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id))) {
                if (result.response.message) {
                    alert(result.response.message)
                }
                return;
            }
            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, result.response.user);
            this.openRout('/');
        }
    }
}