import { Address } from "./Address.model";
import { Person } from "./Person.model";
import { Role } from "./Role.model";

export interface User extends Person, Address {
    id: number;
    role: Role;
    userName: string;
    password: string;
    email: string;
}