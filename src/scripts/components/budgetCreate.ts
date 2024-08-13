import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {UrlParams} from "../utils/url-params";
import {CreateOperationType, OperationType} from "../type/operation.type";
import {RouteString} from "../enum/route-string";
import {OperationTypeString} from "../enum/operation-type-string";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";
import {CategoryType} from "../type/category.type";

export class BudgetCreate {
    readonly typeCategory: OperationTypeString;

    private newOperation: CreateOperationType | null = null;
    private selectTypeElement: HTMLSelectElement | null = null;
    private selectCategoryElement: HTMLSelectElement | null = null;
    private inputSumElement: HTMLInputElement | null = null;
    private inputDateElement: HTMLInputElement | null = null;
    private inputCommentElement: HTMLInputElement | null = null;

    openRoute: Function;

    constructor(openRoute: Function) {
        this.openRoute = openRoute;

        this.selectTypeElement = document.getElementById("input_budget_create_type") as HTMLSelectElement;
        this.selectCategoryElement = document.getElementById("select_budget_create_category") as HTMLSelectElement;
        this.inputSumElement = document.getElementById("input_budget_create_sum") as HTMLInputElement;
        this.inputDateElement = document.getElementById("input_budget_create_date") as HTMLInputElement;
        this.inputCommentElement = document.getElementById("input_budget_create_comment") as HTMLInputElement;

        this.typeCategory = UrlParams.get('type').param as OperationTypeString;
        const optionElement: HTMLOptionElement | null = this.selectTypeElement.querySelector(`option[value='${this.typeCategory}']`);
        if (optionElement) {
            optionElement.selected = true;
        }

        this.getCategories(this.typeCategory).then();

        this.selectTypeElement?.addEventListener('change', this.changeSelectHandler.bind(this));

        document.getElementById("btn_create")?.addEventListener('click', this.clickCreateHandler.bind(this));
    }

    private changeSelectHandler(eve: Event) {
        const element: HTMLSelectElement | null = eve.target as HTMLSelectElement
        this.openRoute(`${RouteString.budgetCreate}?type=${element.value}`);
    }

    private async clickCreateHandler(eve: MouseEvent):Promise<void> {
        const buttonElement: HTMLElement = eve.target as HTMLElement;
        if (buttonElement.classList.contains('btn-success')) {

            //формируем тело запроса
            this.newOperation = {
                type: (this.selectTypeElement?.value)? this.selectTypeElement.value: 'Нет данных',
                category_id: (this.selectCategoryElement?.value)? parseInt(this.selectCategoryElement.value) : null,
                amount: (this.inputSumElement?.value)? parseInt(this.inputSumElement.value): 'Нет данных',
                date: (this.inputDateElement?.value)? this.inputDateElement.value: 'Нет данных',
                comment: (this.inputCommentElement?.value)? this.inputCommentElement.value: 'Нет данных',
            } as CreateOperationType;

            //создаем операцию
            this.createOperation(Config.operationsURL, this.newOperation).then();

        }
    }

    private async getCategories(type: string): Promise<void> {

        let requestUrl: string = '';
        if (type === OperationTypeString.income) {
            requestUrl = Config.categoriesIncomeURL;
        }else if (type === OperationTypeString.expense) {
            requestUrl = Config.categoriesExpenseURL;
        }

        const result: CustomResponseType = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                //добавляем полученные категории в select категорий
                const categories: CategoryType[] = result.response as CategoryType[];
                categories.forEach((category: CategoryType) => {
                    this.selectCategoryElement?.insertAdjacentHTML('beforeend',
                        `<option value="${category.id}">${category.title}</option>`);
                });
            }
        }
    }

    private async createOperation(requestUrl: string, body: CreateOperationType): Promise<void> {
        const result: CustomResponseType = await HttpUtils.request(requestUrl, "POST", true, body);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if ((result.response) && !(result.response as ErrorResponseType).error) {
                let nameType: string;
                (body.type === OperationTypeString.income)? nameType = 'Доход': nameType = "Расход";
                alert(`${nameType} для категории "${(result.response as OperationType).category}" успешно создан.`);
                this.openRoute(`${RouteString.budget}?${Config.DEFAULT_FILTER}`);
            }
        }
    }
}