import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";
import {Filtration} from "./filtration.js";
import Chart from 'chart.js/auto';
import {UrlParams} from "../utils/url-params.js";

export class Main {

    constructor(openRoute) {
        this.openRoute = openRoute;
        this.filterURL = UrlParams.get('filter').param;
        this.containerCharts = document.getElementById('container-charts');
        this.operationsIncomes = [];
        this.operationsExpense = [];

        if (this.filterURL === 'interval') {
            const dataFrom = document.getElementById('interval-date-from');
            const dataTo = document.getElementById('interval-date-to');
            document.addEventListener('change', (eve) => {

                if (eve.target.type === 'date' && (dataFrom.value && dataTo.value)) {

                    this.getOperations().then(() => {
                        this.showCharts();
                    });

                }

            });

        } else {

            this.getOperations().then(() => {
                this.showCharts();
            });

        }

    }

    showCharts() {

        let titleIncome = (this.operationsIncomes.length > 0)? 'Доходы': 'Доходов в этом периоде нет';
        let titleExpense = (this.operationsExpense.length > 0)? 'Расходы': 'Расходов в этом периоде нет';

        this.containerCharts.innerHTML = `
        <article class="circle d-flex flex-column align-items-center justify-content-center">

            <h3 class="fw-bold mb-4">${titleIncome}</h3>

            <canvas id="my-chart-income" class="circle"></canvas>

        </article>

        <div class="circles__line mt-auto"></div>

        <article class="circle d-flex flex-column align-items-center justify-content-center">

            <h3 class="fw-bold mb-4">${titleExpense}</h3>

            <canvas id="my-chart-expense" class="circle"></canvas>

        </article>`;

        const ctxIncome = document.getElementById('my-chart-income');
        const ctxExpense = document.getElementById('my-chart-expense');

        this.getCategories('income').then((categories) => {
            this.chartInit(ctxIncome, this.operationsIncomes, categories);
        });
        this.getCategories('expenses').then((categories) => {
            this.chartInit(ctxExpense, this.operationsExpense, categories);
        });
    }

    formattingCategories(operations, requestCategories) {

        let categories = [];

        if (requestCategories && requestCategories.length > 0) {

            for (let i = 0; i < requestCategories.length; i++) {

                const categoryTitle = requestCategories[i].title;

                let category = {
                    category: null,
                    amount: 0,
                    color: `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0')}`,
                };

                operations.forEach(el => {
                    if (el.category && el.amount && (categoryTitle === el.category)) {
                        category.category = categoryTitle;
                        category.amount += el.amount;
                    }
                });

                if (category.category) {
                    categories.push(category);
                }

            }

        }

        return categories;
    }

    chartInit(ctx, operations, requestCategories) {
        const categories = this.formattingCategories(operations, requestCategories);

        const data = {
            labels: categories.map(el => el.category),
            datasets: [
                {
                    data: categories.map(el => el.amount),
                    backgroundColor: categories.map(el => el.color),
                }
            ]
        };

        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                title: {
                    display: true,
                }
            },
        });
    }


    async getOperations() {

        //получаем даты периода и делаем запрос
        let [dataFrom, dataTo] = Filtration.getPeriod();

        if (!dataFrom || !dataTo) {
            return
        }

        const result = await HttpUtils.request(`${config.operationsURL}?period=interval&dateFrom=${dataFrom}&dateTo=${dataTo}`);
        if (result) {
            if (result.response && !result.response.error) {
                //пушим операции в соответствующие массивы для вывода в графике
                result.response.forEach(el => {
                    if (el.type === "expense") {
                        this.operationsExpense.push(el);
                    } else if (el.type === "income") {
                        this.operationsIncomes.push(el);
                    }
                });
            }
        }
    }

    async getCategories(requestString) {

        let requestUrl = '';

        if (requestString === 'income') {
            requestUrl = config.categoriesIncomeURL;
        } else if (requestString === 'expenses') {
            requestUrl = config.categoriesExpenseURL;
        }

        const result = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                return result.response;
            }
        }
    }
}