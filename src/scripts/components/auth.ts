import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {ProcessFullNameUtils} from "../utils/processFullName-utils";
import {RouteString} from "../enum/route-string";
import {Config} from "../enum/config";
import {AuthRequestType} from "../type/auth-request.type";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";
import {AuthResponseType} from "../type/auth-response.type";
import {tokensType} from "../type/tokens.type";

export class Auth {
    readonly commonErrorElement: HTMLElement | null;

    readonly processBtn: HTMLElement | null = null;
    readonly emailElement: HTMLInputElement | null = null;
    readonly passwordElement: HTMLInputElement | null = null;
    readonly rememberMeElement: HTMLInputElement | null = null;
    readonly fullNameElement: HTMLInputElement | null = null;
    readonly repeatPasswordElement: HTMLInputElement | null = null;

    readonly pageString: RouteString.login | RouteString.signup;
    readonly openRout: Function;

    constructor(pageString: RouteString.login | RouteString.signup, openRout: Function) {
        this.pageString = pageString;
        this.openRout = openRout;

        this.commonErrorElement = document.getElementById('common-error');
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;

        if (this.pageString === RouteString.signup) {
            this.fullNameElement = document.getElementById('full-name') as HTMLInputElement;
            this.repeatPasswordElement = document.getElementById('repeat-password') as HTMLInputElement;
        }

        this.processBtn = document.getElementById('process-btn');
        if (this.processBtn) {
            this.processBtn.addEventListener('click', this.processAuth.bind(this));
        }
    }

    private validateForm(): boolean {

        let isValid: boolean = true;

        if (this.emailElement) {
            if (this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordElement) {
            if (this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.pageString === RouteString.signup) {

            if (this.fullNameElement) {
                if (this.fullNameElement.value && this.fullNameElement.value.match(/^[аА-яЯ]+\s[аА-яЯ]+\s?[аА-яЯ]*$/)) {
                    this.fullNameElement.classList.remove('is-invalid');
                } else {
                    this.fullNameElement.classList.add('is-invalid');
                    isValid = false;
                }
            }

            if (this.repeatPasswordElement && this.passwordElement) {
                if (this.repeatPasswordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) && this.repeatPasswordElement.value === this.passwordElement.value) {
                    this.repeatPasswordElement.classList.remove('is-invalid');
                } else {
                    this.repeatPasswordElement.classList.add('is-invalid');
                    isValid = false;
                }
            }

        }
        return isValid;
    }

    private async processAuth(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {

            if (!this.emailElement || !this.passwordElement) {
                return;
            }

            const emailValue: string = this.emailElement.value;
            const passwordValue: string = this.passwordElement.value;
            if (this.pageString === RouteString.signup) {
                //запрос на создание нового пользователя
                const result: CustomResponseType = await HttpUtils.request(Config.signupUrl, "POST", false, <AuthRequestType>{
                    name: ProcessFullNameUtils.separation((this.fullNameElement?.value as string))?.name,
                    lastName: ProcessFullNameUtils.separation((this.fullNameElement?.value as string))?.lastName,
                    email: emailValue,
                    password: passwordValue,
                    passwordRepeat: this.repeatPasswordElement?.value
                });

                if (result) {
                    if (result.error || !result.response || (result.response && (!(result.response as AuthResponseType).user) || !(result.response as AuthResponseType).user.id)) {
                        if ((result.response as ErrorResponseType).message) {
                            if (this.commonErrorElement) {
                                this.commonErrorElement.style.display = 'block';
                                this.commonErrorElement.innerText = (result.response as ErrorResponseType).message;
                            }
                        }
                        return;
                    } else {
                        //запрос отправляется на сервер и создается новый пользователь
                        alert("Новый пользователь создан")
                    }
                }

            }

            //этот запрос происходит при авторизации и сразу после регистрации(если при авторизации не было ошибки)
            const result: CustomResponseType = await HttpUtils.request(Config.loginUrl, 'POST', false, <AuthRequestType>{
                email: emailValue,
                password: passwordValue
            });

            if (result.error || !result.response || (result.response && (!((result.response as AuthResponseType).tokens as tokensType).accessToken || !((result.response as AuthResponseType).tokens as tokensType).refreshToken || !(result.response as AuthResponseType).user.id))) {
                if ((result.response as ErrorResponseType).message) {
                    alert((result.response as ErrorResponseType).message)
                }
                return;
            }

            AuthUtils.setAuthInfo(((result.response as AuthResponseType).tokens as tokensType).accessToken, ((result.response as AuthResponseType).tokens as tokensType).refreshToken, (result.response as AuthResponseType).user);

            this.openRout(RouteString.main);
        }
    }
}