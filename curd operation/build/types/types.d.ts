export interface User {
    id: number;
    firstname: string;
    lastname: string;
    dob: string;
    mobile: number;
    address: string;
}
export type UserInput = Omit<User, "id">;
//# sourceMappingURL=types.d.ts.map