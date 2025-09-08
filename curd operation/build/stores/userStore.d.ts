import type { User } from "../types/types.js";
import type { UserInput } from "../types/types.js";
export declare const useUserStore: import("pinia").StoreDefinition<"user", {
    users: User[];
    totalPages: number;
    totalUsers: number;
    currentPage: number;
    usersPerPage: number;
}, {}, {
    fetchData({ sort_column, sortOrder, currentPage, usersPerPage, search }?: {
        sort_column?: string | undefined;
        sortOrder?: string | undefined;
        currentPage?: number | undefined;
        usersPerPage?: number | undefined;
        search?: string | undefined;
    }): Promise<void>;
    addUser(newUser: UserInput): Promise<void>;
    getUserById(userId: number): Promise<any>;
    updateUser(userId: number, data: UserInput): Promise<void>;
    deleteUser(userId: number): Promise<void>;
}>;
//# sourceMappingURL=userStore.d.ts.map