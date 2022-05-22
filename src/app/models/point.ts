export class Point {

    idPointUser: String;
    idPoint: string;
    status: string;
    dateDay: string;
    hourPoint: string;

    constructor(obj){
        Object.assign(this, obj, {}, {})
    }
}