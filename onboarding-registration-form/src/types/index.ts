export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Localization {
    [key: string]: string;
}