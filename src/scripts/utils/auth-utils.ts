import {Config} from "../enum/config";
import {AuthInfoType} from "../type/auth-info.type";
import {TokensResponseType} from "../type/tokens-response.type";
import {UserDataType} from "../type/user-data.type";
import {ErrorResponseType} from "../type/error-response.type";

export class AuthUtils {
    public static accessTokenKey: string = Config.accessTokenKey;
    private static refreshTokenKey: string = Config.refreshTokenKey;
    public static userInfoTokenKey: string = Config.userInfoTokenKey;

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserDataType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(key: string): string | AuthInfoType | UserDataType | null {//получение всех данных авторизации или определенного
        const authData: string[] | any = [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey];

        if (key && authData && authData.includes(key)) {
            if (key === this.userInfoTokenKey) {
                const userInfoJson: any = localStorage.getItem(key);
                return JSON.parse(userInfoJson) as UserDataType;
            }
            return localStorage.getItem(key);
        } else {
            const userInfoJson: any = localStorage.getItem(this.userInfoTokenKey);
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey) as string,
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey) as string,
                [this.userInfoTokenKey]: JSON.parse(userInfoJson) as UserDataType
            } as AuthInfoType;
        }
    }
    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey) as string;
        if (refreshToken as string) {
            const response: Response = await fetch(Config.api + Config.refreshTokenURL, <any>{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "refreshToken": refreshToken
                })
            });
            if (response && response.status === 200) {
                const tokensResult: TokensResponseType | ErrorResponseType = await response.json();
                if (tokensResult && !(tokensResult as ErrorResponseType).error) {
                    this.setAuthInfo((tokensResult as TokensResponseType).tokens.accessToken, (tokensResult as TokensResponseType).tokens.refreshToken);
                    result = true;
                } else {
                    throw new Error((tokensResult as ErrorResponseType).message);
                }
            }
        }
        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}