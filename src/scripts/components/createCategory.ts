import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {OperationTypeString} from "../enum/operation-type-string";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";

export class CreateCategory {
    inputCreateElement: HTMLInputElement | null;
    btnCreateElement: HTMLElement | null;
    requestUrl: string = "";
    page: string = '';
    openRoute: Function;

    constructor(page: string, openRoute: Function) {
        this.page = page;
        this.openRoute = openRoute;

        this.inputCreateElement = document.getElementById("input_create") as HTMLInputElement;
        this.btnCreateElement = document.getElementById("btn_create");

        if (this.page === OperationTypeString.income) {
            this.requestUrl = Config.categoriesIncomeURL;
        } else if (this.page === OperationTypeString.expense) {
            this.requestUrl = Config.categoriesExpenseURL;
        }

        if (this.btnCreateElement) {
            this.btnCreateElement.addEventListener('click', this.clickHandler.bind(this));
        }

    }

    private async clickHandler(eve: MouseEvent): Promise<void> {
        const element: HTMLElement = eve.target as HTMLElement;
        if (element.classList.contains('btn-success')) {
            if (!this.inputCreateElement?.value) {
                alert("Имя категории не может быть пустым!");
                return;
            }
            //создаем категорию пользователя
            this.createCategory(this.requestUrl, this.inputCreateElement.value).then();
        }
    }

    //создаем категорию пользователя
    private async createCategory(requestUrl: string, nameCategory: string): Promise<void> {
        const result: CustomResponseType = await HttpUtils.request(requestUrl, "POST", true, {title: nameCategory,});
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                alert(`Категория "${nameCategory}" успешно создана.`);
                this.openRoute(`/${this.page}`);
            } else if (result.response && (result.response as ErrorResponseType).message === 'This record already exists') {
                alert(`Категория "${nameCategory}" уже существует.`);
            }
        }
    }
}