import {HttpUtils} from "../utils/http-utils";
import {Config} from "../enum/config";
import {UrlParams} from "../utils/url-params";
import {OperationTypeString} from "../enum/operation-type-string";
import {CategoryType} from "../type/category.type";
import {CustomResponseType} from "../type/custom-response.type";
import {ErrorResponseType} from "../type/error-response.type";

//получаем категории и добавляем их на страницу(в зависимости от того какая это страница)
export class Categories {
    page: OperationTypeString;
    openRoute: Function;
    ItemCreateElement: HTMLElement | null;
    requestUrl: string = '';

    constructor(page: OperationTypeString, openRoute: Function) {
        this.page = page;
        this.openRoute = openRoute;
        this.ItemCreateElement = document.getElementById('category-item-create');
        if (this.page === OperationTypeString.income) {
            this.requestUrl = Config.categoriesIncomeURL;
        }else if (this.page === OperationTypeString.expense) {
            this.requestUrl = Config.categoriesExpenseURL;
        }

        //получение и добавление категорий на страницу
        this.getCategories(this.requestUrl).then((categories) => {
            const that: Categories = this;
            if(categories) {
                this.showCategories(that, categories);
            }
        });

        //обработчик удаления категории
        document.getElementById("delete-category")?.addEventListener("click", this.deleteCategory.bind(this, this.requestUrl));
    }

    //получаем категории пользователя
    private async getCategories(requestUrl: string): Promise<CategoryType[] | null> {
        const result: CustomResponseType = await HttpUtils.request(requestUrl);
        let categories: CategoryType[] | null = null
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                categories = result.response as CategoryType[];
            }
        }
        return categories as CategoryType[];
    }

    private showCategories(context: Categories, categories: CategoryType[]): void {
        const that: Categories = context;
        if(!this.ItemCreateElement || !categories || categories.length < 1 || !that) {
            return;
        }
        //добавляем полученные категории на страницу
        categories.forEach((category: CategoryType) => {
            that.ItemCreateElement?.insertAdjacentHTML('beforebegin', `
                                            <div class="card" style="width: 22.1rem;">
                                                <div class="card-body">
                                                    <h3 class="card-title fw-bold mb-3">${category.title}</h3>
                                                    <a href="/${that.page}_edit?id=${category.id}&category=${category.title}" 
                                                        role="button" class="btn btn-primary me-1">
                                                        Редактировать
                                                    </a>
                                                    <a href="/${that.page}?id=${category.id}" 
                                                        class="btn btn-danger" data-bs-toggle="modal" 
                                                        data-bs-target="#staticBackdrop">
                                                        Удалить
                                                    </a>
                                                </div>
                                            </div>
                `)
        });
    }

    //удаляем категорию пользователя
    private async deleteCategory(requestUrl: string): Promise<void> {
        const idCategory = UrlParams.get('id').param;
        const result: CustomResponseType = await HttpUtils.request(requestUrl + `/${idCategory}`, "DELETE");//получаем категории доходов пользователя
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !(result.response as ErrorResponseType).error) {
                alert('Категория успешно удалена.');
                this.openRoute(`/${this.page}`);
            }
        }
    }

}