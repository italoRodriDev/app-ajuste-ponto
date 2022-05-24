export class User {

    identification: string;
    idUser: string;
    userName: string;
    name: string;
    typeUser: string;
    manager: any;

    constructor(obj?) {
        Object.assign(this, obj, {}, {});
    }
}
