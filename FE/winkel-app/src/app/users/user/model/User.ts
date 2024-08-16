import { Person } from "./Person";
import { Role } from "./Role";

export interface User extends Person {
    role: Role;
    userName: string;
    password: string;
    email: string;
}