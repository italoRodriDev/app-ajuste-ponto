import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { GetPointService } from 'src/app/services/point/get-point.service';
import { AlertsService } from './../utils/alerts/alerts.service';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { TypeUser } from 'src/app/enums/type-user';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  db = this.fireDatabase.database;
  public bsUser = new BehaviorSubject<User>(null);
  dataUser = this.bsUser.asObservable();
  currentUser: User;
  currentDate = moment().format('DDMMYYYY');

  constructor(
    private alertService: AlertsService,
    private fireAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase,
    private getPointService: GetPointService,
    private navCtrl: NavController
  ) {
    this.getCurrentUser();
  }

  // -> Recuperando usuario atual
  getCurrentUser() {
    return new Promise<void>((resolve) => {
      this.fireAuth.onAuthStateChanged((user) => {
        if (user) {
          this.getDataUser(user?.uid);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  // -> Recuperando dados do usuario
  async getDataUser(idUser: string) {
    if (idUser) {
      await this.db
        .ref('dataUser')
        .child(idUser)
        .on('value', (snapshot) => {
          const data = snapshot.val();

          if (data) {
            this.bsUser.next(data);
            this.currentUser = data;
            this.validateTypeUser(data.typeUser);
          }
        });
    }
  }

  // -> Validando tipo de usuario
  validateTypeUser(typeUser: string) {
    switch (typeUser) {
      case TypeUser.COLABORADOR:
        this.getPointService.getDataPointDayUser(
          this.currentDate,
          this.currentUser
        );
        this.navCtrl.navigateForward('home');
        break;
      case TypeUser.GESTOR:
        this.navCtrl.navigateForward('manager');
        this.getPointService.getPointAllUsers(
          this.currentDate,
          this.currentUser
        );
        break;
    }
  }

  // -> Salvando dados do usuario
  async saveDataUser(dataUser: User) {
    await this.db
      .ref('dataUser')
      .child(dataUser.idUser)
      .update(dataUser)
      .then(() => {
        this.saveNewManager(dataUser);
        this.alertService.showAlert(
          'Parabéns!',
          'Sua conta foi criada com sucesso.',
          'Fique a vontade para continuar explorando o app.'
        );
      })
      .catch((error) => {
        this.alertService.showToast('Algo saiu errado. Erro: ' + error.code);
      });
  }

  // -> Atualizando dados do usuario
  async updateDataManagerUser(dataUser: User, dataManager: User) {
    await this.db
      .ref('dataUser')
      .child(dataUser.idUser)
      .child('manager')
      .update(dataManager)
      .then(() => {
        this.alertService.showAlert(
          'Conta atualizada com sucesso!',
          'Fique a vontade para continuar.',
          ''
        );
      })
      .catch((error) => {
        this.alertService.showToast('Algo saiu errado. Erro: ' + error.code);
      });
  }

  // -> Atualizando dados do usuario
  async updateDataUser(dataUser: User) {
    await this.db
      .ref('dataUser')
      .child(dataUser.idUser)
      .update(dataUser)
      .then(() => {
        this.alertService.showAlert(
          'Conta atualizada com sucesso!',
          'Fique a vontade para continuar.',
          ''
        );
      })
      .catch((error) => {
        this.alertService.showToast('Algo saiu errado. Erro: ' + error.code);
      });
  }

  // -> Salvando dados do gestor
  saveNewManager(dataUser: User) {
    if (dataUser.typeUser == TypeUser.GESTOR) {
      const idFire = this.fireDatabase.createPushId();

      this.db
        .ref('managers')
        .child(idFire)
        .update(dataUser)
        .catch((error) => {
          this.alertService.showToast(
            'Algo saiu errado. Erro ao salvar gestor: ' + error.code
          );
        });
    }
  }
}
