import { Address } from "./Address.model";

export interface Person {
    firstName: string;
    lastName: string;
    birthDate: Date;
    address: Address[]
}