import { User } from './user';
export class PointUserDay {
    idUserPoint: string;
    dateHour: string;
    idUser: string;
    loggedTime: string;
    finishJorney: boolean;
    manager: User;
    user: User;
    constructor(obj){
        Object.assign(this, obj, {}, {});
    }

} 