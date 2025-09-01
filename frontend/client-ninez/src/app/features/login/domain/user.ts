import { RolEnum } from "./enums/role-enum";
import { Entity } from "./entity";

export interface User {
    id: number;
    entidad: Entity;
    nombre: string;
    rol : RolEnum;
}