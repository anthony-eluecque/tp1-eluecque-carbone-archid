import { TodoList } from "./todo"

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export interface ItemsParams { 
    Params : {
        id : string, 
        itemId: string
    }
}

export interface ListParams {
    Params : {
        id: string
    }
}

export interface SuccessResponse<T> {
    message: string;
    data: T;
}

export interface NotFoundResponse {
    message: string;
}

export interface GetListsResponse extends SuccessResponse<TodoList[]> {};
export interface GetListByIdResponse extends SuccessResponse<TodoList> {};

export interface ErrorResponse {
    message: string;
    error: string;
}