import {UrlParams} from "../utils/url-params";
import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {FiltrationString} from "../enum/filtration-string";
import {RouteString} from "../enum/route-string";
import {OperationTypeString} from "../enum/operation-type-string";
import {OperationUpdateType} from "../type/operation-update.type";
import {CategoryType} from "../type/category.type";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";
import {OperationType} from "../type/operation.type";

export class BudgetEdit {
    filterURL: FiltrationString | null = null;
    selectTypeElement: HTMLSelectElement | null = null;
    selectCategoryElement: HTMLSelectElement | null = null;
    inputSumElement: HTMLInputElement | null = null;
    inputDateElement: HTMLInputElement | null = null;
    inputCommentElement: HTMLInputElement | null = null;

    openRoute: Function;

    constructor(openRoute: Function) {
        this.openRoute = openRoute;

        this.filterURL = UrlParams.get(Config.UTMFilter).param as FiltrationString;
        this.selectTypeElement = document.getElementById("input_budget_create_type") as HTMLSelectElement;
        this.selectCategoryElement = document.getElementById("select_budget_create_category") as HTMLSelectElement;
        this.inputSumElement = document.getElementById("input_budget_create_sum") as HTMLInputElement;
        this.inputDateElement = document.getElementById("input_budget_create_date") as HTMLInputElement;
        this.inputCommentElement = document.getElementById("input_budget_create_comment") as HTMLInputElement;

        //записывает текущие данные операции в поля для редактирования
        this.getOperation().then((operation: OperationType | null) => {
            if (!operation) {
                return
            }

            if (this.selectTypeElement) {
                const optionElement: HTMLOptionElement | null = this.selectTypeElement.querySelector(`option[value='${operation.type}']`);
                if (optionElement) {
                    optionElement.selected = true
                }

            }

            if (operation.type === Config.categoriesIncomeURL) {
                (this.selectTypeElement as HTMLSelectElement).value = operation.type;
            } else if (operation.type === Config.categoriesExpenseURL) {
                (this.selectTypeElement as HTMLSelectElement).value = operation.type;
            }

            this.getCategories(operation.type).then((categories: CategoryType[] | null) => {
                if (!categories) {
                    return;
                }
                const category: CategoryType | undefined = categories.find(item => item.title === operation.category);
                if (this.selectCategoryElement) {
                    let selectValue: string = '';
                    if (category) {
                        const optionElement: HTMLOptionElement | null = this.selectCategoryElement.querySelector(`option[value='${category.id}']`);
                        if (optionElement) {
                            optionElement.selected = true;
                            selectValue = category.id.toString();
                        }
                    }
                    this.selectCategoryElement.value = selectValue;
                }
            });

            if (this.inputSumElement) {
                this.inputSumElement.value = operation.amount.toString();
            }
            if (this.inputDateElement) {
                this.inputDateElement.value = operation.date;
            }
            if (this.inputCommentElement) {
                this.inputCommentElement.value = operation.comment;
            }

        });

        this.selectTypeElement.addEventListener('change', this.changeSelectHandler.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private changeSelectHandler(eve: Event): void {
        const element = eve.target as HTMLOptionElement
        const optionValue: string = element.value;
        this.openRoute(`${RouteString.budgetCreate}?type=${optionValue}`);
    }

    private async clickHandler(eve: MouseEvent): Promise<void> {
        const element: HTMLElement = eve.target as HTMLElement;
        //формируем тело запроса
        const currentOperation: OperationUpdateType = {
            type: (this.selectTypeElement?.value) ? this.selectTypeElement.value : null,
            category_id: (this.selectCategoryElement?.value) ? parseFloat(this.selectCategoryElement.value) : null,
            amount: (this.inputSumElement?.value) ? parseFloat(this.inputSumElement.value) : null,
            date: (this.inputDateElement?.value) ? this.inputDateElement.value : null,
            comment: (this.inputCommentElement?.value) ? this.inputCommentElement.value : null,
        };

        if (element.classList.contains('btn-success')) {
            if (!currentOperation.category_id) {
                return alert('Выберите категорию');
            }
            await this.putOperation(currentOperation);
            this.openRoute(`${RouteString.budget}?${Config.UTMFilter}=${this.filterURL}`);
        } else if (element.classList.contains('btn-danger')) {
            this.openRoute(`${RouteString.budget}?${Config.UTMFilter}=${this.filterURL}`);
        }
    }

    private async getCategories(type: string): Promise<CategoryType[] | null> {
        let categories: CategoryType[] | null = null;
        let requestUrl: string | undefined;
        if (type === OperationTypeString.income) {
            requestUrl = Config.categoriesIncomeURL;
        } else if (type === OperationTypeString.expense) {
            requestUrl = Config.categoriesExpenseURL;
        }
        if (!requestUrl) {
            return null;
        }

        const result: CustomResponseType = await HttpUtils.request(requestUrl);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                //добавляем полученные категории в select категорий;
                categories = result.response as CategoryType[];
                if (categories && categories.length > 0) {
                    categories.forEach((category: CategoryType) => {
                        this.selectCategoryElement?.insertAdjacentHTML('beforeend',
                            `<option value="${category.id}">${category.title}</option>`);
                    });
                }
            }
        }
        return categories;
    }

    private async getOperation(): Promise<OperationType | null> {
        //находим операцию доход расход по utm метке
        let operation: OperationType | null = null;
        const operationID: string = UrlParams.get('id').param as string;
        const result: CustomResponseType = await HttpUtils.request(`${Config.operationsURL}/${operationID}`);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                operation = result.response as OperationType;
            }
        }
        return operation;
    }

    private async putOperation(body: OperationUpdateType): Promise<void> {
        const operationID = UrlParams.get('id').param;
        const result = await HttpUtils.request(`${Config.operationsURL}/${operationID}`, "PUT", true, body);
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
        }
    }
}