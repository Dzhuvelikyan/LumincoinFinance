import {requests} from "../config.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static setUserInfo(userInfo) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }
    static checkAuth(openRout, rout = "/login") {
        if (openRout && typeof openRout === "function") {
            if (!localStorage.getItem(this.accessTokenKey)) {
                openRout(rout);
            }
        }
    }
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
    static async processUnauthorizedResponse() {//получение новой пары токенов на основе старого рефреш токена
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(requests.refresh, {//запрос на получение новой пары токенов
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        return false;
    }
}