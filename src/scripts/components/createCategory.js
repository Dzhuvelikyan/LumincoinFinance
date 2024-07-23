import {HttpUtils} from "../utils/http-utils";
import {config} from "../config.js";

export class CreateCategory {
    inputCreateElement = document.getElementById("input_create");

    btnCreateElement = document.getElementById("btn_create");

    constructor(page, openRoute) {
        this.page = page;
        this.openRoute = openRoute;

        if (this.page === 'income') {
            this.requestUrl = config.categoriesIncomeURL;
        } else if (this.page === 'expenses') {
            this.requestUrl = config.categoriesExpenseURL;
        }

        this.btnCreateElement.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(eve) {
        if (eve.target.classList.contains('btn-success')) {
            if (!this.inputCreateElement.value) {
                return alert("Имя категории не может быть пустым!")
            }
            //создаем категорию пользователя
            this.createCategory(this.requestUrl, this.inputCreateElement.value).then();
        }
    }

    //создаем категорию пользователя
    async createCategory(requestUrl, nameCategory) {
        const result = await HttpUtils.request(requestUrl, "POST", true, {title: nameCategory,});
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                alert(`Категория "${nameCategory}" успешно создана.`);
                this.openRoute(`/${this.page}`);
            } else if (result.response && result.response.message === 'This record already exists') {
                alert(`Категория "${nameCategory}" уже существует.`);
            }
        }
    }
}