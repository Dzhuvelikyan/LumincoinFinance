import {Auth} from "../service/auth.js";
import {CustomHttp} from "../service/custom-http.js";
import {requests} from "../config.js";
import {ProcessFulName} from "../utils/processFulName.js";

export class Signup {
    fullNameElement = document.getElementById('full-name');
    emailElement = document.getElementById('email');
    passwordElement = document.getElementById('password');
    repeatPasswordElement = document.getElementById('repeat-password');

    constructor(openRout) {
        this.openRout = openRout;
        if (localStorage.getItem(Auth.accessTokenKey)) {
            this.openRout('/');
        }
        document.getElementById("signup-process-btn").addEventListener('click', this.processForm.bind(this));
    }

    validateForm() {
        let isValid = true;
        if (this.fullNameElement.value && this.fullNameElement.value.match(/^[аА-яЯ]+\s[аА-яЯ]+\s?[аА-яЯ]*$/)) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            this.fullNameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.emailElement && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.repeatPasswordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) && this.repeatPasswordElement.value === this.passwordElement.value) {
            this.repeatPasswordElement.classList.remove('is-invalid');
        } else {
            this.repeatPasswordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {
            try {
                const result = await CustomHttp.requestPOST(requests.signUp, {
                    name: ProcessFulName.separation(this.fullNameElement.value).name,
                    lastName: ProcessFulName.separation(this.fullNameElement.value).lastName,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.repeatPasswordElement.value
                });
                if (result) {
                    if (result.error || !result.user) {
                        alert(result.message);
                        throw new Error();
                    } else {
                        this.openRout('/login');
                    }
                }
            } catch(error) {
                console.log(error);
            }
        }
    }
}