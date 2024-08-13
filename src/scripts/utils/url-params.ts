//получение URL-параметров страницы
import {RouteString} from "../enum/route-string";
import {QueryParamType} from "../type/query-param.type";

export class UrlParams {
    public static get(urlParamArg: string = 'id'): QueryParamType {
        let result: QueryParamType = {
            param: null,
            redirect: null,
        }
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);//получаем объект с параметрами из URL
        const param: string | null = urlParams.get(urlParamArg);//находим нужный параметр из объекта urlParams

        if (param) {
            result.param = param;
            result.redirect = (param) ? null : RouteString.main;
        }
        return result
    }
    // public static innerQueryParams(queryParams:QueryParamType = this.get()) {
    //     const paramsURL: QueryParamType = queryParams;
    //     if (paramsURL && Object.keys(paramsURL).length > 0) {
    //         let utmMarksString : string = "";
    //         for (const paramsURLKey in paramsURL) {
    //             utmMarksString += (!utmMarksString ? "?" : "&") + paramsURLKey + "=" + paramsURL[paramsURLKey];
    //         }
    //         console.log(utmMarksString);//делаем нужные действия со строкой query-параметров(записываем сформированные query параметры в адресную строку)
    //     } else {
    //         console.log("UTM-меток не обнаружено");
    //     }
    // }
}