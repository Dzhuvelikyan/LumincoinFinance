import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";

export class Main {
    userBalanceElement = document.getElementById('user-balance');
    constructor(openRoute) {
        this.openRoute = openRoute;
        //this.getUserBalance().then();
    }

    async getUserBalance() {
        const result = await HttpUtils.request('/balance');//получаем баланс пользователя
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response.balance) {
                this.userBalanceElement.innerText = result.response.balance + config.currency;
            }
        }
    }
}