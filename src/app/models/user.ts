export class User {

    idUser: string;
    userName: string;
    typeUser: string;
    manager: any;

    constructor(obj?) {
        Object.assign(this, obj, {}, {});
    }
}
