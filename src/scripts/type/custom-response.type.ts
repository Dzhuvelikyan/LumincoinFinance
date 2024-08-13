import {RouteString} from "../enum/route-string";
import {ErrorResponseType} from "./error-response.type";
import {AuthResponseType} from "./auth-response.type";
import {OperationType} from "./operation.type";
import {tokensType} from "./tokens.type";
import {CategoryType} from "./category.type";

export type CustomResponseType = {
    error: boolean,
    response: any | null,//в этом свойстве будет ответ от сервера
    redirect: RouteString | null;
}