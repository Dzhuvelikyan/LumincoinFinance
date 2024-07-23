import {UrlParams} from "./url-params.js";
import {DateTime} from "luxon";

export class FilterOperation {
    static init(operation) {
        const typeFilter = UrlParams.get('filter').param;
        const todayDate = DateTime.now();
        const [year, month, day] = [operation.date.split('-')[0], operation.date.split('-')[1],operation.date.split('-')[2]];
        const operationDate = DateTime.fromObject({ year: year, month: month, day: day, hour: 0, minute: 0 });

        if (!operation.id || !operation.date) {
            return;
        }
        let currentOperation = null;
        if (typeFilter === 'today'){

            if (operationDate.day === todayDate.day && operationDate.month === todayDate.month && operationDate.year === todayDate.year) {

                currentOperation = operation;
            }

        } else if (typeFilter === 'all') {

            currentOperation = operation;

        } else if (typeFilter === 'week') {

            if (operationDate <= todayDate && operationDate >= DateTime.now().minus({week: 1})) {
                currentOperation = operation;
            }

        } else if (typeFilter === 'month') {

            if (operationDate <= todayDate && operationDate >= DateTime.now().minus({month: 1})) {
                currentOperation = operation;
            }

        } else if (typeFilter === 'year') {
            console.log(DateTime.now().minus({year: 1}));
            if (operationDate <= todayDate && operationDate >= DateTime.now().minus({year: 1})) {
                currentOperation = operation;
                console.log(currentOperation);
            }

        } else if (typeFilter === 'interval') {

            currentOperation = operation;

        }

        return currentOperation;

    }
}