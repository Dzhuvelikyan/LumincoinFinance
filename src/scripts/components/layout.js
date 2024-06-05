import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";

export class Layout {
    navBtnElements = document.querySelectorAll("#layout-navigation a");
    accordionCategoryBtn = document.getElementById('accordion-button-category');
    accordionCategoryList = document.getElementById('collapseOne');
    userBalanceElement = document.getElementById('user-balance');
    constructor(openRoute) {
        this.openRoute = openRoute;
        this.toggleClassButtonsNav();
        this.getUserBalance().then();
    }
    toggleClassButtonsNav() {
        this.navBtnElements.forEach(btn=> {
            if (btn.href.replace(window.location.origin, '') === window.location.pathname) {
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