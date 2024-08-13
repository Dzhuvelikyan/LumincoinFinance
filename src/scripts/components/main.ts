import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {Filtration} from "./filtration";
import {UrlParams} from "../utils/url-params";
import {FiltrationString} from "../enum/filtration-string";
import {OperationType} from "../type/operation.type";
import {CategoryType} from "../type/category.type";
import {CustomCategory} from "../type/custom-categories.type";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";
import {OperationTypeString} from "../enum/operation-type-string";
import {DatePeriodType} from "../type/date-period.type";
//import {Chart, ChartConfiguration, ChartData, ChartDataSets, ChartOptions} from 'chart.js';
import { Chart, ChartData, ChartConfiguration } from "chart.js";


export class Main {
    readonly openRoute: Function;
    readonly filterURL: string;
    readonly containerCharts: HTMLElement | null;
    private readonly operationsIncomes: OperationType[];
    readonly operationsExpense: OperationType[];

    constructor(openRoute: Function) {
        this.openRoute = openRoute;
        this.filterURL = UrlParams.get('filter').param as FiltrationString;
        this.containerCharts = document.getElementById('container-charts');
        this.operationsIncomes = [];
        this.operationsExpense = [];

        if (this.filterURL === FiltrationString.interval) {
            const dataFrom: HTMLInputElement | null = document.getElementById('interval-date-from') as HTMLInputElement;
            const dataTo: HTMLInputElement | null  = document.getElementById('interval-date-to') as HTMLInputElement;

            document.addEventListener('change', (eve) => {

                if ((eve.target as HTMLInputElement).type === 'date' && (dataFrom.value && dataTo.value)) {
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

    private showCharts(): void {
        if(!this.containerCharts){return}
        let titleIncome: string = (this.operationsIncomes.length > 0)? 'Доходы': 'Доходов в этом периоде нет';
        let titleExpense: string = (this.operationsExpense.length > 0)? 'Расходы': 'Расходов в этом периоде нет';

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

        const ctxIncome: HTMLCanvasElement | null = document.getElementById('my-chart-income') as HTMLCanvasElement;
        const ctxExpense: HTMLCanvasElement | null = document.getElementById('my-chart-expense') as HTMLCanvasElement;

        this.getCategories(OperationTypeString.income).then((categories: CategoryType[] | null) => {
            if (categories) {
                this.chartInit(ctxIncome, this.operationsIncomes, categories);
            }
        });
        this.getCategories(OperationTypeString.expense).then((categories: CategoryType[] | null) => {
            if (categories) {
                this.chartInit(ctxExpense, this.operationsExpense, categories);
            }
        });
    }

    private formattingCategories(operations: OperationType[], requestCategories: CategoryType[]): CustomCategory[] {
        let customCategories: CustomCategory[] = [];

        if (requestCategories && requestCategories.length > 0) {

            for (let i = 0; i < requestCategories.length; i++) {

                const categoryTitle: string = requestCategories[i].title;
                const categoryColor: string = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`;//.padEnd(6, '0')

                let customCategory: CustomCategory = {
                    category: '',
                    amount: 0,
                    color: categoryColor,
                };

                operations.forEach((el: OperationType )=> {
                    if (el.category && el.amount && (categoryTitle === el.category)) {
                        customCategory.category = categoryTitle;
                        customCategory.amount += el.amount;
                    }
                });

                if (customCategory.category) {
                    customCategory.amount;
                    customCategories.push(customCategory);
                }

            }

        }

        return customCategories;
    }

    private chartInit(ctx: HTMLCanvasElement, operations: OperationType[], requestCategories: CategoryType[]): void {
        const categories: CustomCategory[] = this.formattingCategories(operations, requestCategories);

        const dataChart: ChartData = {
            labels: categories.map(el => el.category),
            datasets: [
                {
                    data: categories.map(el => el.amount),
                    backgroundColor: categories.map(el => el.color),
                }
            ]
        };

        const optionsChart: ChartConfiguration = {
            type: 'pie',
            data: dataChart,
            options: {
                responsive: true,
            },
        }

        new Chart (ctx, optionsChart);
    }

    private async getOperations(): Promise<void> {

        //получаем даты периода и делаем запрос
        const dataPeriod: DatePeriodType | undefined = Filtration.getPeriod();

        if (!dataPeriod) {
            return
        }

        const result: CustomResponseType = await HttpUtils.request(`${Config.operationsURL}?${Config.UTMPeriod}=${FiltrationString.interval}&${Config.UTMDateFrom}=${dataPeriod.dataFrom}&${Config.UTMDateTo}=${dataPeriod.dataTo}`);
        if (result) {
            if (result.response && !(result.response as ErrorResponseType).error) {
                //пушим операции в соответствующие массивы для вывода в графике
                (result.response as OperationType[]).forEach((el: OperationType) => {
                    if (el.type === OperationTypeString.expense) {
                        this.operationsExpense.push(el);
                    } else if (el.type === OperationTypeString.income) {
                        this.operationsIncomes.push(el);
                    }
                });
            }
        }
    }

    private async getCategories(requestString: OperationTypeString):Promise<CategoryType[] | null> {
        let categories: CategoryType[] | null = null;
        let requestUrl: string = '';

        if (requestString === OperationTypeString.income) {
            requestUrl = Config.categoriesIncomeURL;
        } else if (requestString === OperationTypeString.expense) {
            requestUrl = Config.categoriesExpenseURL;
        }

        const result: CustomResponseType = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                categories = result.response as CategoryType[];
            }
        }
        return categories;
    }
}