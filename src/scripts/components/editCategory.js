import {UrlParams} from "../utils/url-params.js";
import {HttpUtils} from "../utils/http-utils";
import {config} from "../config.js";

export class EditCategory {
    urlParams = {
        id: UrlParams.get('id').param,
        category: UrlParams.get('category').param,
    }

    inputEditElement = document.getElementById("input_edit");
    
    constructor(page, openRoute) {
        this.page = page;
        this.openRoute = openRoute;

        if (this.page === 'income') {
            this.requestUrl = config.categoriesIncomeURL;
        }else if (this.page === 'expenses') {
            this.requestUrl = config.categoriesExpenseURL;
        }

        this.inputEditElement.value = this.urlParams.category;

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(eve) {
        if (eve.target.classList.contains('btn-success')) {
            this.putCategory(this.requestUrl, this.inputEditElement.value).then();
            this.openRoute(`/${this.page}`);
        } else if (eve.target.classList.contains('btn-danger')) {
            this.openRoute(`/${this.page}`);
        }
    }
    async putCategory(requestUrl, value) {
        const result = await HttpUtils.request(requestUrl + `/${this.urlParams.id}`, "PUT", true, {
            title: value,
        });//изменяем имя категории
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
        }
    }
}