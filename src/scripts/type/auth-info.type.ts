import {UserDataType} from "./user-data.type";
import {Config} from "../enum/config";

export type AuthInfoType = {
    [Config.accessTokenKey]: string | null,
    [Config.refreshTokenKey]: string | null,
    [Config.userInfoTokenKey]: UserDataType | null
}