import {UserDataType} from "./user-data.type";
import {tokensType} from "./tokens.type";


export type AuthResponseType = {
    tokens?: tokensType,
    user: UserDataType,
}