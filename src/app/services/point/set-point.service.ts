import { PointUserDay } from './../../models/point-user-day';
import { TypePoint } from './../../enums/type-point';
import { AlertsService } from './../utils/alerts/alerts.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { Point } from 'src/app/models/point';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SetPointService {
  db = this.fireDatabase.database;

  constructor(
    private fireDatabase: AngularFireDatabase,
    private alertService: AlertsService
  ) {}

  // -> Marcando ponto de inicio de jornada
  setPointJorney(idPoint: string, userData: User, typePoint: TypePoint) {
    const currentDate = moment().format();

    if (userData.manager != null) {
      const data = new PointUserDay({
        idUserPoint: idPoint,
        idUser: userData.idUser,
        dateHour: currentDate,
        user: userData,
        manager: userData.manager,
      });

      this.db
        .ref('pointUser')
        .child(idPoint)
        .child(userData.idUser)
        .update(data)
        .then(() => {
          this.setPointDay(idPoint, typePoint, userData);
        })
        .catch((error) => {
          this.alertService.showAlert(
            'Algo saiu errado!',
            'Verifique sua conexão!',
            'ERRO: ' + error?.code
          );
        });
    } else {
      this.alertService.showAlert(
        'Selecione seu gestor primeiro',
        'Você pode fazer isso indo até configurações.',
        ''
      );
    }
  }

  // -> Inserindo ponto
  setPointDay(idPointDay, typePoint: TypePoint, userData: User) {
    const idFire = this.fireDatabase.createPushId();

    const data = new Point({
      idPoint: idFire,
      idPointUser: idPointDay,
      status: typePoint,
      dateDay: moment().format(),
      hourPoint: moment().format(),
    });

    this.db
      .ref('pointsDay')
      .child(idPointDay)
      .child(userData.idUser)
      .child(idFire)
      .update(data)
      .then(() => {
        this.validateTypePoint(typePoint);
      })
      .catch((error) => {
        this.alertService.showAlert(
          'Algo saiu errado!',
          'Verifique sua conexão!',
          'ERRO: ' + error?.code
        );
      });
  }

  // -> Validando tipo do ponto
  validateTypePoint(typePoint: TypePoint) {
    let statusType = TypePoint.ENTRADA;

    switch (typePoint) {
      case TypePoint.ENTRADA:
        statusType = TypePoint.ENTRADA;
        break;
      case TypePoint.PAUSA:
        statusType = TypePoint.PAUSA;
        break;
      case TypePoint.REFEICAO:
        statusType = TypePoint.REFEICAO;
        break;
      case TypePoint.SAIDA:
        statusType = TypePoint.SAIDA;
        break;
    }

    return this.alertService.showAlert(
      'Ponto assinado com sucesso!',
      `Status: ${statusType}`,
      'Fique a vontade para continuar.'
    );
  }
}
