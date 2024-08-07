import {UrlParams} from "../utils/url-params.js";
import {DateTime} from "luxon";
import {FormattingDate} from "../utils/fomatting-date.js";
export class Filtration {
    static DEFAULT_FILTER = '/?filter=today';

    static activeButton() {//добавляем активный класс кнопке в зависимости от query-параметра
        const filterURL = UrlParams.get('filter').param;

        if (!filterURL) {
            location.href = this.DEFAULT_FILTER;
            return;
        }

        const navFilterElements = document.querySelectorAll('.nav-buttons a');//кнопки навигации
        const inputFromElement = document.getElementById('interval-date-from');
        const inputToElement = document.getElementById('interval-date-to');

        navFilterElements.forEach(btn => {
            if (btn.href.includes(filterURL)) {
                btn.classList.add('active');
            }
            if (filterURL === 'interval') {
                setTimeout(() => {
                    inputFromElement.closest('label').classList.add('active');
                    inputToElement.closest('label').classList.add('active');
                }, 10);
            } else {
                inputFromElement.closest('label').classList.remove('active');
                inputToElement.closest('label').classList.remove('active');
            }
        });
    }

    static getPeriod() {
        const filter = UrlParams.get('filter').param;
        const today = DateTime.now();
        let dataFrom = null;
        let dataTo = `${today.year}-${FormattingDate.init(today.month)}-${FormattingDate.init(today.day)}`;//сегодня
        let period = {week: 1}

        switch (filter) {
            case 'today':
                dataFrom = dataTo;
                break;
            case 'all':
                period = {year: 10}
                break;
            case 'week':
                period = {week: 1}
                break;
            case 'month':
                period = {month: 1}
                break;
            case 'year':
                period = {year: 1}
                break;
            case 'interval':
                dataFrom = document.getElementById('interval-date-from').value;
                dataTo = document.getElementById('interval-date-to').value;
                break;
        }

        if (filter !== 'interval' && filter !== 'today') {
            dataFrom = `${today.minus(period).year}-${FormattingDate.init(today.minus(period).month)}-${FormattingDate.init(today.minus(period).day)}`;
        }

        return [dataFrom, dataTo];

    }

}