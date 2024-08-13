import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {AuthUtils} from "../utils/auth-utils";
import {UserDataType} from "../type/user-data.type";
import {CustomResponseType} from "../type/custom-response.type";

export class Layout {
    readonly openRoute: Function;
    readonly userElement: HTMLElement | null;
    readonly userNameElement: HTMLElement | null;
    readonly navBtnElements: HTMLLinkElement[];
    readonly accordionCategoryBtn: HTMLElement | null;
    readonly accordionCategoryList: HTMLElement | null;
    readonly userBalanceElement: HTMLElement | null;

    userInfo: UserDataType;
    constructor(openRoute: Function) {
        this.openRoute = openRoute;

        this.userElement = document.getElementById("user");
        this.userNameElement = document.getElementById("user-name");
        this.navBtnElements = Array.from(document.querySelectorAll("#layout-navigation a"));
        this.accordionCategoryBtn = document.getElementById('accordion-button-category');
        this.accordionCategoryList = document.getElementById('collapseOne');
        this.userBalanceElement = document.getElementById('user-balance');

        this.userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) as UserDataType;

        //выводим имя пользователя на страницу
        if (this.userInfo && this.userNameElement) {
            this.userNameElement.innerText = this.userInfo.name + ' ' + this.userInfo.lastName;
        }

        this.toggleClassButtonsNav();
        if(this.userElement) {
            this.userElement.addEventListener('click', this.showUserParams);
        }

        //выводим баланс на страницу
        setTimeout(() => {
            this.getUserBalance().then();
        }, 100);
    }

    private async getUserBalance(): Promise<void> {
        const result: CustomResponseType = await HttpUtils.request(Config.balanceURL);//получаем баланс пользователя
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if ((result.response as {balance: number}).balance && this.userBalanceElement) {
                this.userBalanceElement.innerText = (result.response as {balance: number}).balance.toString() + Config.currency;
            }
        }
    }

    private toggleClassButtonsNav(): void {

        this.navBtnElements.forEach((btn: any)=> {
            if (btn.href.replace(window.location.origin, '').split('?')[0] === window.location.pathname.split('?')[0]) {
                btn.classList.add('active');
                if(btn.closest('#collapseOne')) {
                    this.accordionCategoryBtn?.classList.remove('collapsed');
                    this.accordionCategoryList?.classList.add('show');
                } else {
                    this.accordionCategoryBtn?.classList.add('collapsed');
                    this.accordionCategoryList?.classList.remove('show');
                }
            } else {
                btn.classList.remove('active');
            }
        });
    }

    private showUserParams(eve: MouseEvent): void {
        const userParamsElement: HTMLElement | null = document.getElementById("user-params");
        const element: HTMLElement | null = eve.target as HTMLElement;

        if(!userParamsElement || !element) {return}

        if (element.classList.contains('user__icon') || element.closest('.user__icon')) {
            userParamsElement.classList.add('show');
        }
        if (element.classList.contains("user__params-close") || element.closest('.user__params-close')) {
            userParamsElement.classList.remove('show');
        }
    }
}