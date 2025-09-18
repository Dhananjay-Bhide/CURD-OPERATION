export interface User {
    id: number;
    firstname: string;
    lastname: string;
    dob: string;
    mobile: number;
    address: string;
}

export interface GetQueryParams {
    sort_column?: string;
    sort_order?: 'asc' | 'desc';
    currentPage?: string;
    usersPerPage?: string;
    search?: string;
}