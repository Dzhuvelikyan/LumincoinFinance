import {Auth} from "./auth.js";

export class CustomHttp {
    static async requestGET(url, token = null) {
        const params = {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        }
        if (token && typeof token === "string") {
            params.headers["x-access-token"] = token;
        }
        const response = await fetch(url, params);//для будущих запросов
    }
    static async requestPOST(url, body) {
        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body),
        }
        if (body && typeof body === 'object') {
            const response = await fetch(url, params);
            return this.responseProcess(response, url, params)
        } else {
            console.log("Не корректное 'body' в POST-запросе");
        }
    }

    static async responseProcess(response, url, body) {
        if (response.status < 200 || response.status >= 300) {//если ответ от сервера не успешный
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();//запрос на получение новой пары токенов
                if (result) {
                    return await this.requestPOST(url, body);
                } else {
                    return null;
                }
            }
            throw new Error(response.message);
        }
        return await response.json();
    }
}