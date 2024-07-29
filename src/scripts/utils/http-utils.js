import {AuthUtils} from "./auth-utils.js";
import {config} from "../config.js";
export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {

        const result = {//главный объект с результатами запроса который в итоге будем возвращать
            error: false,
            response: null,//в этом свойстве будет ответ от сервера
            redirect: null
        }

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        };

        let token = null;//нужен для флага useAuth и для обработки кода 401

        if (useAuth){//если нужна авторизация при запросе то получаем токен и добавляем в headers ключ с токеном
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body){
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch(error) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (response.status === 401 && useAuth) {
                if (!token) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //повторяем запрос(метод) c теми-же аргументами которые передались при запросе, если получилось обновить токены
                        return await this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}