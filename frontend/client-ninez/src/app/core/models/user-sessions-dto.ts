import { User } from "./user";

export interface UserSessionsDTO {
    token: string;
    usuario: User;
}