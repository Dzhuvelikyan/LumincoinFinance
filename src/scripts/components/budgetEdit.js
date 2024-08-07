import {UrlParams} from "../utils/url-params.js";
import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";

export class BudgetEdit {
    filterURL = UrlParams.get('filter').param;
    selectTypeElement = document.getElementById("input_budget_create_type");
    selectCategoryElement = document.getElementById("select_budget_create_category");
    inputSumElement = document.getElementById("input_budget_create_sum");
    inputDateElement = document.getElementById("input_budget_create_date");
    inputCommentElement = document.getElementById("input_budget_create_comment");


    constructor(openRoute) {
        this.openRoute = openRoute;

        //записывает текущие данные операции в поля для редактирования
        this.getOperation().then(operation => {
            this.selectTypeElement.querySelector(`option[value='${operation.type}']`).selected = true;

            if (operation.type === 'income') {
                this.selectTypeElement.value = operation.type;
            } else if (operation.type === 'expense') {
                this.selectTypeElement.value = operation.type;
            }

            this.getCategories(operation.type).then(categories => {
                const category = categories.find(item => item.title === operation.category);
                if (category) {
                    this.selectCategoryElement.querySelector(`option[value='${category.id}']`).selected = true;
                    this.selectCategoryElement.value = category.id;
                } else {
                    this.selectCategoryElement.value = null;
                }
            });

            this.inputSumElement.value = operation.amount;
            this.inputDateElement.value = operation.date;
            this.inputCommentElement.value = operation.comment;
        });

        this.selectTypeElement.addEventListener('change', this.changeSelectHandler.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    changeSelectHandler(eve) {
        this.openRoute(`/budget_create?type=${eve.target.value}`);
    }

    async clickHandler(eve) {

        //формируем тело запроса
        this.currentOperation = {
            type: (this.selectTypeElement.value) ? this.selectTypeElement.value : 'Нет данных',
            category_id: (this.selectCategoryElement.value) ? parseInt(this.selectCategoryElement.value) : null,
            amount: (this.inputSumElement.value) ? parseInt(this.inputSumElement.value) : 'Нет данных',
            date: (this.inputDateElement.value) ? this.inputDateElement.value : 'Нет данных',
            comment: (this.inputCommentElement.value) ? this.inputCommentElement.value : 'Нет данных',
        };

        if (eve.target.classList.contains('btn-success')) {
            if (!this.currentOperation.category_id) {
                return alert('Выберите категорию');
            }
            await this.putOperation(this.currentOperation);
            this.openRoute(`/budget?filter=${this.filterURL}`);
        } else if (eve.target.classList.contains('btn-danger')) {
            this.openRoute(`/budget?filter=${this.filterURL}`);
        }
    }

    async getCategories(type) {

        let requestUrl;
        if (type === 'income') {
            requestUrl = config.categoriesIncomeURL;
        } else if (type === 'expense') {
            requestUrl = config.categoriesExpenseURL;
        }

        const result = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                //добавляем полученные категории в select категорий;
                result.response.forEach(category => {
                    this.selectCategoryElement.insertAdjacentHTML('beforeend',
                        `<option value="${category.id}">${category.title}</option>`);
                });
                return result.response;
            }
        }
    }

    async getOperation() {
        //находим операцию доход расход по utm метке
        const operationID = UrlParams.get('id').param;
        const result = await HttpUtils.request(`${config.operationsURL}/${operationID}`);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                return result.response;
            }
        }
    }

    async putOperation(body) {
        const operationID = UrlParams.get('id').param;
        const result = await HttpUtils.request(`${config.operationsURL}/${operationID}`, "PUT", true, body);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
        }
    }
}