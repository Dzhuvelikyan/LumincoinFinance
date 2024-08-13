import {UrlParams} from "../utils/url-params";
import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {OperationTypeString} from "../enum/operation-type-string";
import {CustomResponseType} from "../type/custom-response.type";

export class EditCategory {
    readonly urlParams: {id: string, category: string};

    readonly inputEditElement: HTMLInputElement | null;
    readonly requestUrl: string = '';
    readonly page: string = '';
    openRoute: Function;
    
    constructor(page: string, openRoute: Function) {
        this.urlParams = {
            id: UrlParams.get('id').param,
            category: UrlParams.get('category').param,
        } as {id: string, category: string};

        this.inputEditElement = document.getElementById("input_edit") as HTMLInputElement;
        this.page = page;
        this.openRoute = openRoute;

        if (this.page === OperationTypeString.income) {
            this.requestUrl = Config.categoriesIncomeURL;
        }else if (this.page === OperationTypeString.expense) {
            this.requestUrl = Config.categoriesExpenseURL;
        }

        this.inputEditElement.value = this.urlParams.category;

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async clickHandler(eve: MouseEvent): Promise<void> {
        const element: HTMLElement = eve.target as HTMLElement;

        let inputValue: string = '';
        if (this.inputEditElement) {
            inputValue = this.inputEditElement.value;
        }

        if (element.classList.contains('btn-success')) {
            this.putCategory(this.requestUrl, inputValue).then();
            this.openRoute(`/${this.page}`);
        } else if (element.classList.contains('btn-danger')) {
            this.openRoute(`/${this.page}`);
        }
    }
    private async putCategory(requestUrl: string, value: string): Promise<void> {
        const result: CustomResponseType = await HttpUtils.request(requestUrl + `/${this.urlParams.id}`, "PUT", true, {
            title: value,
        } as {title: string});//изменяем имя категории
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
        }
    }
}