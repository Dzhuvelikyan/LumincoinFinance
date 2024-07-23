import {HttpUtils} from "../utils/http-utils.js";
import {config} from "../config.js";
import {UrlParams} from "../utils/url-params.js";

//получаем категории и добавляем их на страницу(в зависимости от того какая это страница)
export class Categories {
    ItemCreateElement = document.getElementById('category-item-create');
    requestUrl = null;

    constructor(page, openRoute) {
        this.page = page;
        this.openRoute = openRoute;

        if (this.page === 'income') {
            this.requestUrl = config.categoriesIncomeURL;
        }else if (this.page === 'expenses') {
            this.requestUrl = config.categoriesExpenseURL;
        }

        //получение и добавление категорий на страницу
        this.getCategories(this.requestUrl).then(categories => {
            this.showCategories.call(this, categories);
        });

        //обработчик удаления категории
        document.getElementById("delete-category").addEventListener("click", this.deleteCategory.bind(this, this.requestUrl));
    }

    //получаем категории пользователя
    async getCategories(requestUrl) {
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

    showCategories(categories) {
        if(!this.ItemCreateElement || (!categories && categories.length === 0)) {
             return;
        }
        console.log(categories);
        //добавляем полученные категории на страницу
        categories.forEach(category => {
            this.ItemCreateElement.insertAdjacentHTML('beforebegin', `
                                            <div class="card" style="width: 22.1rem;">
                                                <div class="card-body">
                                                    <h3 class="card-title fw-bold mb-3">${category.title}</h3>
                                                    <a href="/${this.page}_edit?id=${category.id}&category=${category.title}" 
                                                        role="button" class="btn btn-primary me-1">
                                                        Редактировать
                                                    </a>
                                                    <a href="/${this.page}?id=${category.id}" 
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
    async deleteCategory(requestUrl) {
        const idCategory = UrlParams.get('id').param;
        const result = await HttpUtils.request(requestUrl + `/${idCategory}`, "DELETE");//получаем категории доходов пользователя
        if (result) {
            if (result.redirect) {//проверяем нужен ли редирект на логин
                this.openRoute(result.redirect);
            }
            if (result.response && !result.response.error) {
                alert('Категория успешно удалена.');
                this.openRoute(`/${this.page}`);
            }
        }
    }

}