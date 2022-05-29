import { TypeStatusAdjustment } from './../../enums/type-status-adjustment-pont';
import { BehaviorSubject } from 'rxjs';
import { AlertsService } from './../utils/alerts/alerts.service';
import { User } from './../../models/user';
import { FormsService } from 'src/app/services/forms/forms.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { PointAdjustment } from 'src/app/models/point-adjustment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AdjustmentPointService {
  formAdjustment = this.formService.formAdjustmentPoint;
  db = this.fireDatabase.database;
  currentDate = moment().format('DDMMYYYY');

  private bsAdjustment = new BehaviorSubject([]);
  listAdjustment = this.bsAdjustment.asObservable();

  constructor(
    private formService: FormsService,
    private alertService: AlertsService,
    private fireDatabase: AngularFireDatabase
  ) {
    this.getAllAdjustment(this.currentDate, null);
  }

  // -> Salvando dados do ajuste
  saveDataAdjustment(typeAdjustment, userData: User, listAdjustment: Array<any>) {
    const id = moment().format('DDMMYYYY');
    const currentDate = moment().format();

    const data = new PointAdjustment({
      idAdj: id,
      idUser: userData.idUser,
      dateSolicitation: currentDate,
      nameUser: userData.userName,
      user: userData,
      typeAdj: typeAdjustment,
      listPoints: listAdjustment,
    });

    this.db
      .ref('adjustment')
      .child(id)
      .child(userData.idUser)
      .update(data)
      .then(() => {
        this.alertService.showAlert(
          'Solicitação de ajuste enviada com sucesso!',
          'Agora é com seu gestor.',
          'Aguarde a análise da sua solicitação.'
        );
      })
      .catch((error) => {
        this.alertService.showAlert(
          'Algo saiu errado!',
          'Verifique sua conexão!',
          'ERRO: ' + error?.code
        );
      });
  }

  // -> Atualizando status do ajuste
  updateStatusAdjustment(pointAdj: PointAdjustment,userData: User, status: TypeStatusAdjustment) {
    
    this.db
      .ref('adjustment')
      .child(pointAdj.idAdj)
      .child(userData.idUser)
      .update({ status: status })
      .then(() => {
        this.alertService.showAlert(
          'Status atualizado com sucesso!',
          `Atualizado para: ${status}`,
          'Fique a vontade para continuar.'
        );
      })
      .catch((error) => {
        this.alertService.showAlert(
          'Algo saiu errado!',
          'Verifique sua conexão!',
          'ERRO: ' + error?.code
        );
      });
  }

  // -> Recuperando todos os ajustes
  getAllAdjustment(date: string, status: TypeStatusAdjustment) {
    const filter = this.db.ref('adjustment').child(date);

    if (status != null) {
      filter.orderByChild('status').equalTo(status);
    }

    filter
      .once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const array = Object.keys(data).map((index) => data[index]);
          this.bsAdjustment.next([]);
          this.bsAdjustment.next(array);
        }
      })
      .catch((error) => {
        this.alertService.showAlert(
          'Algo saiu errado!',
          'Verifique sua conexão!',
          'ERRO: ' + error?.code
        );
      });
  }
}
