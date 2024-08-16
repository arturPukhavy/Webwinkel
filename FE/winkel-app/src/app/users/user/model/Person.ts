import { Address } from "./Address";

export interface Person {
    firstName: string;
    lastName: string;
    birthDate: Date;
    address: Address[]
}