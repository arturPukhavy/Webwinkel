import { Person } from "./Person.model";
import { Role } from "./Role.model";

export interface User extends Person {
    role: Role;
    userName: string;
    password: string;
    email: string;
}