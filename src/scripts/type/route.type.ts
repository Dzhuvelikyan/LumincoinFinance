export type RouteType = {
    route: string,
    title?: string,
    layout?: string | boolean,
    template?: string,
    styles?: string[],
    filtration?: boolean,
    load(): void
}