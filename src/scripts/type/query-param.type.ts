import {RouteString} from "../enum/route-string";
import {FiltrationString} from "../enum/filtration-string";

export type QueryParamType = {
    param: string | FiltrationString | null,
    redirect: RouteString | null,
}