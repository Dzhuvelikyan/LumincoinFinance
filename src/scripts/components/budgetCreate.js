import {HttpUtils} from "../utils/http-utils";
import {config} from "../config.js";
import {UrlParams} from "../utils/url-params.js";

export class BudgetCreate {
    typeCategory = UrlParams.get('type').param;

    newOperation = {};
    selectTypeElement = document.getElementById("input_budget_create_type");
    selectCategoryElement = document.getElementById("select_budget_create_category");
    inputSumElement = document.getElementById("input_budget_create_sum");
    inputDateElement = document.getElementById("input_budget_create_date");
    inputCommentElement = document.getElementById("input_budget_create_comment");

    constructor(openRoute) {
        this.openRoute = openRoute;

        this.selectTypeElement.querySelector(`option[value='${this.typeCategory}']`).selected = true;

        this.getCategories(this.typeCategory).then();

        this.selectTypeElement.addEventListener('change', this.changeSelectHandler.bind(this));

        document.getElementById("btn_create").addEventListener('click', this.clickCreateHandler.bind(this));
    }

    changeSelectHandler(eve) {
        this.openRoute(`/budget_create?type=${eve.target.value}`);
    }

    async clickCreateHandler(eve) {
        if (eve.target.classList.contains('btn-success')) {

            //формируем тело запроса
            this.newOperation = {
                type: (this.selectTypeElement.value)? this.selectTypeElement.value: 'Нет данных',
                category_id: (this.selectCategoryElement.value)? parseInt(this.selectCategoryElement.value) : null,
                amount: (this.inputSumElement.value)? parseInt(this.inputSumElement.value): 'Нет данных',
                date: (this.inputDateElement.value)? this.inputDateElement.value: 'Нет данных',
                comment: (this.inputCommentElement.value)? this.inputCommentElement.value: 'Нет данных',
            };

            //создаем операцию
            this.createOperation(config.operationsURL, this.newOperation).then();

        }
    }

    async getCategories(type) {

        let requestUrl;
        if (type === 'income') {
            requestUrl = config.categoriesIncomeURL;
        }else if (type === 'expense') {
            requestUrl = config.categoriesExpenseURL;
        }

        const result = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                //добавляем полученные категории в select категорий
                result.response.forEach(category => {
                    this.selectCategoryElement.insertAdjacentHTML('beforeend',
                        `<option value="${category.id}">${category.title}</option>`);
                });
            }
        }
    }

    async createOperation(requestUrl, body) {
        const result = await HttpUtils.request(requestUrl, "POST", true, body);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                let nameType;
                (body.type === 'income')? nameType = 'Доход': nameType = "Расход";
                alert(`${nameType} для категории "${result.response.category}" успешно создан.`);
                this.openRoute(`/budget?filter=today`);
            }
            // else if (result.response && result.response.message === 'This record already exists') {
            //     alert(`Категория "${nameCategory}" уже существует.`);
            // }
        }
    }
}