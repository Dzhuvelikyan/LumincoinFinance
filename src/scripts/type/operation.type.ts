export type OperationType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type CreateOperationType = {
    type: string,
    amount: number,
    date: string,
    comment: string,
    category_id: number
}
