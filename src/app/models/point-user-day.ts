import { User } from './user';
export class PointUserDay {
    idUserPoint: string;
    dateHour: string;
    idUser: string;
    user: User;
    constructor(obj){
        Object.assign(this, obj, {}, {});
    }

} 