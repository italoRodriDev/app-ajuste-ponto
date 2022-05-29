import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as moment from 'moment';
import { Point } from 'src/app/models/point';
import { User } from 'src/app/models/user';
import { TypePoint } from './../../enums/type-point';
import { PointUserDay } from './../../models/point-user-day';
import { AlertsService } from './../utils/alerts/alerts.service';

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
  setPointJorney(
    idPoint: string,
    userData: User,
    typePoint: TypePoint,
    loggedTime: string
  ) {
    const currentDate = moment().format();

    if (userData.manager != null) {
      const data = new PointUserDay({
        idUserPoint: idPoint,
        idUser: userData.idUser,
        dateHour: currentDate,
        user: userData,
        finishJorney: typePoint == TypePoint.SAIDA ? true : false,
        loggedTime: loggedTime,
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
    const currentDate = moment().format();

    const data = new Point({
      idPoint: idFire,
      idPointUser: idPointDay,
      status: typePoint,
      dateDay: currentDate,
      hourPoint: currentDate,
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

  // -> Salvando ajuste no ponto
  saveAdjustmentPoint(
    dataUsePoint: PointUserDay,
    dataPoint: Point,
    newDate: string
  ) {
    const newDatePoint = moment(newDate).format();
    const label = `
    Ajustado de ${moment(dataPoint.hourPoint).format('hh:mm a DD/MM/YY')}
    para ${moment(newDatePoint).format()}
    `;

    this.db
      .ref('pointsDay')
      .child(dataUsePoint.idUserPoint)
      .child(dataUsePoint.idUser)
      .child(dataPoint.idPoint)
      .update({ hourPoint: newDatePoint, adjustment: label })
      .then(() => {
        this.alertService.showAlert(
          'Ponto ajustado com sucesso!',
          'Fique a vontadde para continuar!',
          'As mudanças podem demorar um pouco para aparecer.'
        );
      })
      .catch(() => {
        this.alertService.showAlert(
          'Ocorreu um erro ao atualizar o ponto!',
          'Contato o suporte do sistema.',
          'Verifique também sua conexão.'
        );
      });
  }

  // -> Excluindo ponto
  RemovePointAdjustment(dataUsePoint: PointUserDay, dataPoint: Point) {
    this.db
      .ref('pointsDay')
      .child(dataUsePoint.idUserPoint)
      .child(dataUsePoint.idUser)
      .child(dataPoint.idPoint)
      .remove()
      .then(() => {
        this.alertService.showAlert(
          'Ponto excluido com sucesso!',
          'Fique a vontadde para continuar.',
          'As mudanças podem demorar um pouco para aparecer.'
        );
      })
      .catch(() => {
        this.alertService.showAlert(
          'Ocorreu um erro ao excluir o ponto!',
          'Contato o suporte do sistema.',
          'Verifique também sua conexão.'
        );
      });
  }
}
