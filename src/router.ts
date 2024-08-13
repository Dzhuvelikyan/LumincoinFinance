import {Auth} from "./scripts/components/auth";
import {Layout} from "./scripts/components/layout";
import {AuthUtils} from "./scripts/utils/auth-utils";
import {Categories} from "./scripts/components/categories";
import {EditCategory} from "./scripts/components/editCategory";
import {Main} from "./scripts/components/main";
import {CreateCategory} from "./scripts/components/createCategory";
import {Budget} from "./scripts/components/budget";
import {BudgetEdit} from "./scripts/components/budgetEdit";
import {BudgetCreate} from "./scripts/components/budgetCreate";
import {Filtration} from "./scripts/components/filtration";
import {RouteType} from "./scripts/type/route.type";
import {RouteString} from "./scripts/enum/route-string";
import {OperationTypeString} from "./scripts/enum/operation-type-string";

export class Router {
    pageTitleElement: HTMLElement | null;
    contentElement: HTMLElement | null;
    routes: RouteType[];

    constructor() {

        this.pageTitleElement = document.getElementById('page-title');
        this.contentElement = document.getElementById('content');

        this.routes = [
            {
                route: RouteString.login,
                title: 'Авторизация',
                layout: false,
                template: '/templates/auth/login.html',
                styles: ['form.css'],
                load: () => {
                    new Auth(RouteString.login,this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.signup,
                title: 'Регистрация',
                layout: false,
                template: '/templates/auth/signup.html',
                styles: ['form.css'],
                load: () => {
                    new Auth(RouteString.signup, this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.logout,
                load: () => {
                    AuthUtils.removeAuthInfo();
                    this.openRoute(RouteString.login).then();
                }
            },
            {
                route: RouteString.main,
                title: 'Главная',
                layout: '/templates/layout.html',
                template: '/templates/main.html',
                styles: ['layout.css', 'main.css'],
                filtration: true,
                load: () => {
                    new Main(this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.budget,
                title: 'Доходы и расходы',
                layout: '/templates/layout.html',
                template: '/templates/budget/budget.html',
                styles: ['layout.css', 'budget.css'],
                filtration: true,
                load: () => {
                    new Budget(this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.budgetCreate,
                title: 'Доходы и расходы: Создание',
                layout: '/templates/layout.html',
                template: '/templates/budget/budget_create.html',
                styles: ['layout.css'],
                load: () => {
                    new BudgetCreate(this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.budgetEdit,
                title: 'Доходы и расходы: Редактирование',
                layout: '/templates/layout.html',
                template: '/templates/budget/budget_edit.html',
                styles: ['layout.css'],
                load: () => {
                    new BudgetEdit(this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.income,
                title: 'Доходы',
                layout: '/templates/layout.html',
                template: '/templates/income/income.html',
                styles: ['layout.css'],
                load: () => {
                    new Categories(OperationTypeString.income, this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.incomeCreate,
                title: 'Доходы: Создание категории',
                layout: '/templates/layout.html',
                template: '/templates/income/income_create.html',
                styles: ['layout.css'],
                load: () => {
                    new CreateCategory(OperationTypeString.income ,this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.incomeEdit,
                title: 'Доходы: Редактирование категории',
                layout: '/templates/layout.html',
                template: '/templates/income/income_edit.html',
                styles: ['layout.css'],
                load: () => {
                    new EditCategory(OperationTypeString.income ,this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.expenses,
                title: 'Расходы',
                layout: '/templates/layout.html',
                template: '/templates/expenses/expenses.html',
                styles: ['layout.css'],
                load: () => {
                    new Categories(OperationTypeString.expense, this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.expensesCreate,
                title: 'Расходы: Создание категории',
                layout: '/templates/layout.html',
                template: '/templates/expenses/expenses_create.html',
                styles: ['layout.css'],
                load: () => {
                    new CreateCategory(OperationTypeString.expense ,this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.expensesEdit,
                title: 'Расходы: Редактирование категории',
                layout: '/templates/layout.html',
                template: '/templates/expenses/expenses_edit.html',
                styles: ['layout.css'],
                load: () => {
                    new EditCategory(OperationTypeString.expense,this.openRoute.bind(this));
                }
            },
            {
                route: RouteString.notFound,
                title: 'Страница не найдена',
                layout: false,
                template: '/templates/404.html',
                load: () => {
                    console.log("Страница не найдена!");
                }
            }
        ];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async clickHandler(eve: MouseEvent): Promise<void> {
        const target = eve.target as HTMLElement;
        const linkElement = target.closest<HTMLAnchorElement>('a');
        if (linkElement) {
            eve.preventDefault();
            const newUrl: string = linkElement.href.replace(window.location.origin, '');
            if (!newUrl || newUrl === "/#" || newUrl.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openRoute(newUrl);
        }
    }

    // private async clickHandler(eve: MouseEvent): Promise<void> {
    //     let linkElement: HTMLLinkElement | null = null;
    //     if ((eve.target as HTMLLinkElement).nodeName === 'A') {
    //         linkElement = (eve.target as HTMLLinkElement);
    //     } else if ((eve.target as ParentNode).parentNode.nodeName === 'A') {
    //         (linkElement as ParentNode) = (eve.target as HTMLElement).parentNode;
    //     }
    //     if (linkElement) {
    //         eve.preventDefault();
    //         const newUrl: string = linkElement.href.replace(window.location.origin, '');
    //         if (!newUrl || newUrl === "/#" || newUrl.startsWith('javascript:void(0)')) {
    //             return;
    //         }
    //         await this.openRoute(newUrl);
    //     } else {
    //         return ;
    //     }
    // }

    public async openRoute(newUrl: string):Promise<void> {
        const oldUrl: string = window.location.pathname;
        window.history.pushState({}, '', newUrl);
        await this.activateRoute(null, oldUrl);
    }

    private async activateRoute(eve: PopStateEvent | Event | null = null, oldUrl: string | null = null):Promise<void> {
        const currentRoute:RouteType | undefined = this.routes.find(item => item.route === window.location.pathname);
        if (currentRoute) {
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach((style:string) => {
                    const linkStyle: string = `<link rel="stylesheet" href="styles/${style}">`;
                    document.head.insertAdjacentHTML('beforeend', linkStyle);
                });
            }
            if (currentRoute.title && this.pageTitleElement) {
                this.pageTitleElement.innerText = currentRoute.title;
            }
            if (currentRoute.template) {

                if (!this.contentElement) {
                    return ;
                }

                if (currentRoute.layout) {

                    let layoutContent: HTMLElement | null = document.getElementById('layout-content');
                    if (!layoutContent) {

                        this.contentElement.innerHTML = await fetch((currentRoute.layout as string)).then((response) => response.text());

                        layoutContent = document.getElementById('layout-content');
                    }

                    if (layoutContent) {
                        layoutContent.innerHTML = await fetch(currentRoute.template).then(response => response.text());
                    }

                    new Layout(this.openRoute.bind(this));
                } else {

                    this.contentElement.innerHTML = await fetch(currentRoute.template).then(response => response.text());

                }
            }
            if (currentRoute.filtration) {
                //подключаем фильтрацию расходов\доходов
                Filtration.activeButton();
            }
            if (currentRoute.load && typeof currentRoute.load === "function") {
                currentRoute.load();
            }
        } else {
            console.log("No route found");
            window.history.pushState({}, '', "/404");//записываем в адрес браузера код 404
            await this.activateRoute(null);//запускаем метод заново что бы отобразить страницу 404
        }
        //удаляем стили прошлого роута
        if (oldUrl) {
            const oldRoute = this.routes.find(route => route.route === oldUrl);
            if (oldRoute && oldRoute.styles && oldRoute.styles.length > 0) {
                oldRoute.styles.forEach(style => {
                    document.querySelector(`link[href='styles/${style}']`)?.remove();
                });
            }
        }
    }
}