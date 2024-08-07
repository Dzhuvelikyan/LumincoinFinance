import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";
import {AuthUtils} from "../utils/auth-utils.js";

export class Layout {
    userElement = document.getElementById("user");
    userNameElement = document.getElementById("user-name");
    navBtnElements = document.querySelectorAll("#layout-navigation a");
    accordionCategoryBtn = document.getElementById('accordion-button-category');
    accordionCategoryList = document.getElementById('collapseOne');
    userBalanceElement = document.getElementById('user-balance');
    constructor(openRoute) {
        this.openRoute = openRoute;

        //выводим баланс на страницу
        setTimeout(() => {
            this.getUserBalance().then();
        }, 100)

        //выводим имя пользователя на страницу
        if (AuthUtils.getAuthInfo().userInfo) {
            this.userNameElement.innerText = AuthUtils.getAuthInfo().userInfo.name + ' ' + AuthUtils.getAuthInfo().userInfo.lastName;
        }

        this.toggleClassButtonsNav();
        if(this.userElement) {
            this.userElement.addEventListener('click', this.showUserParams)
        }
    }

    async getUserBalance() {
        const result = await HttpUtils.request('/balance');//получаем баланс пользователя
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response.balance) {
                this.userBalanceElement.innerText = result.response.balance + config.currency
            }
        }
    }

    toggleClassButtonsNav() {

        this.navBtnElements.forEach(btn=> {
            if (btn.href.replace(window.location.origin, '').split('?')[0] === window.location.pathname.split('?')[0]) {
                btn.classList.add('active');
                if(btn.closest('#collapseOne')) {
                    this.accordionCategoryBtn.classList.remove('collapsed');
                    this.accordionCategoryList.classList.add('show');
                } else {
                    this.accordionCategoryBtn.classList.add('collapsed');
                    this.accordionCategoryList.classList.remove('show');
                }
            } else {
                btn.classList.remove('active');
            }
        });

    }

    showUserParams(eve) {
        const userParamsElement = document.getElementById("user-params");
        if (eve.target.classList.contains('user__icon') || eve.target.closest('.user__icon')) {
            userParamsElement.classList.add('show');
        }
        if (eve.target.classList.contains("user__params-close") || eve.target.closest('.user__params-close')) {
            userParamsElement.classList.remove('show');
        }
    }
}