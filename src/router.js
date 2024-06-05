import {Auth} from "./scripts/components/auth.js";
import {Layout} from "./scripts/components/layout.js";

export class Router {
    pageTitleElement = document.getElementById('page-title');
    contentElement = document.getElementById('content');
    routes = [
        {
            route: '/404',
            title: 'Страница не найдена',
            layout: false,
            template: '/templates/404.html',
            styles: [],
            load: () => {

            }
        },
        {
            route: '/login',
            title: 'Авторизация',
            layout: false,
            template: '/templates/auth/login.html',
            styles: ['form.css'],
            load: () => {
                new Auth('login',this.openRoute.bind(this));
            }
        },
        {
            route: '/signup',
            title: 'Регистрация',
            layout: false,
            template: '/templates/auth/signup.html',
            styles: ['form.css'],
            load: () => {
                new Auth('signup', this.openRoute.bind(this));
            }
        },
        {
            route: '/',
            title: 'Главная',
            layout: '/templates/layout.html',
            template: '/templates/main.html',
            styles: ['layout.css', 'main.css'],
            load: () => {

            }
        },
        {
            route: '/budget',
            title: 'Доходы и расходы',
            layout: '/templates/layout.html',
            template: '/templates/budget/budget.html',
            styles: ['layout.css', 'budget.css'],
            load: () => {

            }
        },
        {
            route: '/budget_create',
            title: 'Доходы и расходы: Создание',
            layout: '/templates/layout.html',
            template: '/templates/budget/budget_create.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/budget_edit',
            title: 'Доходы и расходы: Редактирование',
            layout: '/templates/layout.html',
            template: '/templates/budget/budget_edit.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/income',
            title: 'Доходы',
            layout: '/templates/layout.html',
            template: '/templates/income/income.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/income_create',
            title: 'Доходы: Создание категории',
            layout: '/templates/layout.html',
            template: '/templates/income/income_create.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/income_edit',
            title: 'Доходы: Редактирование категории',
            layout: '/templates/layout.html',
            template: '/templates/income/income_edit.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/expenses',
            title: 'Расходы',
            layout: '/templates/layout.html',
            template: '/templates/expenses/expenses.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/expenses_create',
            title: 'Расходы: Создание категории',
            layout: '/templates/layout.html',
            template: '/templates/expenses/expenses_create.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
        {
            route: '/expenses_edit',
            title: 'Расходы: Редактирование категории',
            layout: '/templates/layout.html',
            template: '/templates/expenses/expenses_edit.html',
            styles: ['layout.css'],
            load: () => {

            }
        },
    ];

    constructor() {
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(eve) {
        let linkElement = null;
        if (eve.target.nodeName === 'A') {
            linkElement = eve.target;
        } else if (eve.target.parentNode.nodeName === 'A') {
            linkElement = eve.target.parentNode;
        }
        if (linkElement) {
            eve.preventDefault();
            const newUrl = linkElement.href.replace(window.location.origin, '');
            if (!newUrl || newUrl === "/#" || newUrl.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openRoute(newUrl);
        }
    }

    async openRoute(newUrl) {
        const oldUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
        await this.activateRoute(null, oldUrl);
    }

    async activateRoute(eve = null, oldUrl = null) {
        const currentRoute = this.routes.find(item => item.route === window.location.pathname);
        if (currentRoute) {
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    const linkStyle = `<link rel="stylesheet" href="styles/${style}">`;
                    document.head.insertAdjacentHTML('beforeend', linkStyle);
                });
            }
            if (currentRoute.title) {
                this.pageTitleElement.innerText = currentRoute.title
            }
            if (currentRoute.template) {
                if (currentRoute.layout) {
                    let layoutContent = document.getElementById('layout-content');
                    if (!layoutContent) {
                        this.contentElement.innerHTML = await fetch(currentRoute.layout).then(response => response.text());
                        layoutContent = document.getElementById('layout-content');
                    }
                    layoutContent.innerHTML = await fetch(currentRoute.template).then(response => response.text());
                    new Layout(this.openRoute.bind(this));
                } else {
                    this.contentElement.innerHTML = await fetch(currentRoute.template).then(response => response.text());
                }
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
                    document.querySelector(`link[href='styles/${style}']`).remove();
                });
            }
        }
    }
}