import {AuthUtils} from "./auth-utils";
import {Config} from "../enum/config";
import {CustomResponseType} from "../type/custom-response.type";
import {RouteString} from "../enum/route-string";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<any> {

        const result: CustomResponseType = {//главный объект с результатами запроса который в итоге будем возвращать
            error: false,
            response: null,//в этом свойстве будет ответ от сервера
            redirect: null
        }

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        };

        let token: string | null = null;//нужен для флага useAuth и для обработки кода 401

        if (useAuth){//если нужна авторизация при запросе то получаем токен и добавляем в headers ключ с токеном

            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string;
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body){
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(Config.api + url, params);
            result.response = await response.json();
        } catch(error) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (response.status === 401 && useAuth) {
                if (!token) {
                    result.redirect = RouteString.login;
                } else {
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //повторяем запрос(метод) c теми-же аргументами которые передались при запросе, если получилось обновить токены
                        return await this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = RouteString.login;
                    }
                }
            }
        }
        return result;
    }
}