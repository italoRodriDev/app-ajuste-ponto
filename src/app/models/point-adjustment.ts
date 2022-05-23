import { User } from './user';

export class PointAdjustment {
  idAdj: string;
  idUser: string;
  dateSolicitation: string;
  nameUser: string;
  user: User;
  listPoints: Array<any>;
  constructor(obj) {
    Object.assign(this, obj, {}, {});
  }
}
