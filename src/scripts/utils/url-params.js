//получение URL-параметров страницы
export class UrlParams {
    static get(urlParamArg = 'id') {
        let result = {
            param: null,
            redirect: null,
        }
        const urlParams = new URLSearchParams(window.location.search);//получаем объект с параметрами из URL
        const param = urlParams.get(urlParamArg);//находим нужный параметр из объекта urlParams

        if (param) {
            result.param = param;
            result.redirect = (param) ? null : '/';
        }
        return result
    }
    static innerQueryParams(queryParams = this.get()) {
        const paramsURL = queryParams;
        if (paramsURL && Object.keys(paramsURL).length > 0) {
            let utmMarksString = "";
            for (const paramsURLKey in paramsURL) {
                utmMarksString += (!utmMarksString ? "?" : "&") + paramsURLKey + "=" + paramsURL[paramsURLKey];
            }
            console.log(utmMarksString);//делаем нужные действия со строкой query-параметров
        } else {
            console.log("UTM-меток не обнаружено");
        }
    }
}