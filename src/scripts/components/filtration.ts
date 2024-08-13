import {UrlParams} from "../utils/url-params";
import {FormattingDate} from "../utils/fomatting-date";
import {FiltrationString} from "../enum/filtration-string";
import {Config} from "../enum/config";
import {DatePeriodType} from "../type/date-period.type";
import { DateTime } from "luxon";
export class Filtration {
    static readonly DEFAULT_FILTER: string = Config.DEFAULT_FILTER;

    public static activeButton() {//добавляем активный класс кнопке в зависимости от query-параметра
        const filterURL: FiltrationString | null = UrlParams.get(Config.UTMFilter).param as FiltrationString | null;

        if (!filterURL) {
            location.href = this.DEFAULT_FILTER;
            return;
        }

        const navFilterElements: HTMLLinkElement[] = Array.from(document.querySelectorAll('.nav-buttons a')) ;//кнопки навигации
        const inputFromElement: HTMLInputElement | null = document.getElementById('interval-date-from') as HTMLInputElement;
        const inputToElement: HTMLInputElement | null = document.getElementById('interval-date-to') as HTMLInputElement;

        navFilterElements.forEach((btn: HTMLLinkElement) => {
            if (btn.href.includes(filterURL)) {
                btn.classList.add('active');
            }

            //добавляем анимацию появления инпутам(период)
            if (inputFromElement && inputToElement) {
                if (filterURL === 'interval') {

                    setTimeout(() => {
                        inputFromElement.closest('label')?.classList.add('active');
                        inputToElement.closest('label')?.classList.add('active');
                    }, 10);
                } else {
                    inputFromElement.closest('label')?.classList.remove('active');
                    inputToElement.closest('label')?.classList.remove('active');
                }
            }
        });
    }

    public static getPeriod(): DatePeriodType | undefined {
        const filter: FiltrationString = UrlParams.get(Config.UTMFilter).param as FiltrationString;
        const today: any = DateTime.local();
        let dataFrom: string | null = null;
        let dataTo: string = `${today.year}-${FormattingDate.init(today.month)}-${FormattingDate.init(today.day)}`;//сегодня
        let period: any = {week: 1}
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
                dataFrom = (document.getElementById('interval-date-from') as HTMLInputElement).value;
                dataTo = (document.getElementById('interval-date-to') as HTMLInputElement).value;
                break;
        }

        if (filter !== 'interval' && filter !== 'today') {
            dataFrom = `${today.minus(period).year.toString()}-${FormattingDate.init(today.minus(period).month.toString())}-${FormattingDate.init(today.minus(period).day.toString())}`;
        }

        if (dataFrom && dataTo) {
            const dataPeriod: DatePeriodType = {
                dataFrom: dataFrom,
                dataTo: dataTo
            };
            return dataPeriod as DatePeriodType;
        }

    }

}