import { User } from './../../models/user';
import { AlertsService } from './../utils/alerts/alerts.service';
import { Injectable, Type } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FormsService } from '../forms/forms.service';
import { TypeUser } from 'src/app/enums/type-user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  db = this.fireDatabase.database;
  formSign: FormGroup = this.formsService.formSign;
  formSignUp: FormGroup = this.formsService.formSignUp;
  token: boolean = false;
  idUser: string;

  private bsUser = new BehaviorSubject<User>(null);
  dataUser = this.bsUser.asObservable();

  constructor(
    private formsService: FormsService,
    private alertService: AlertsService,
    private fireAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.getCurrentUser();
  }

  // -> Recuperando usuario atual
  getCurrentUser() {
    return new Promise<void>((resolve) => {
      this.fireAuth.onAuthStateChanged((user) => {
        if (user) {
          this.getDataUser(user.uid);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  // -> Logando usuario com email e senha
  signUser() {
    const userName = this.formSign.controls.userName.value + '@ti.com';
    const password = this.formSign.controls.password.value;

    return new Promise<void>((resolve) => {
      this.fireAuth
        .setPersistence('local')
        .then(() => {
          this.fireAuth
            .signInWithEmailAndPassword(userName, password)
            .then((res) => {
              const idUser = res.user.uid;
              this.getDataUser(idUser);
              resolve();
            })
            .catch((error) => {
              this.validateErrorAuth(error.code);
            });
        })
        .catch((error) => {
          this.validateErrorAuth(error.code);
        });
    });
  }

  // -> Criando conta do usuario
  async createAccountUser() {
    const userName = this.formSignUp.controls.userName.value + '@ti.com';
    const password = this.formSignUp.controls.password.value;
    const typeUser = this.formSignUp.controls.type.value;

    return new Promise<void>(async (resolve) => {
      await this.fireAuth
        .createUserWithEmailAndPassword(userName, password)
        .then(async (res) => {
          const idUser = res.user.uid;

          const dataUser: User = new User({
            idUser: idUser,
            userName: userName,
            typeUser: typeUser,
          });

          this.saveDataUser(dataUser);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          this.validateErrorAuth(error.code);
        });
    });
  }

  // -> Recuperando dados do usuario
  async getDataUser(idUser: string) {

    await this.db
      .ref('dataUser')
      .child(idUser)
      .once('value', (snapshot) => {
        const data = snapshot.val();
     
        if (data) {
    
          switch (this.router.url) {
            case '/login':
              this.bsUser.next(data);
              this.validateTypeUser(data.typeUser);
              break;
            case '/create-account':
              this.bsUser.next(data);
              this.validateTypeUser(data.typeUser);
              break;
            default:
              this.bsUser.next(data);
          }
        }
      });
  }

  // -> Salvando dados do usuario
  async saveDataUser(dataUser: User) {
    await this.db
      .ref('dataUser')
      .child(dataUser.idUser)
      .update(dataUser)
      .then(() => {
        this.saveNewManager(dataUser);
        this.validateTypeUser(dataUser.typeUser);
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
  async updateDataUser(dataUser: User, dataManager: User) {
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

  // -> Validando tipo de usuario
  validateTypeUser(typeUser: string) {
    console.log(typeUser);
    switch (typeUser) {
      case TypeUser.COLABORADOR:
        this.navCtrl.navigateForward('home');
        break;
      case TypeUser.GESTOR:
        this.navCtrl.navigateForward('manager');
        break;
    }
    this.alertService.showToast('Login realizado com sucesso.');
  }

  // -> Validando excecoes firebase
  validateErrorAuth(res) {
    switch (res) {
      case 'auth/invalid-email':
        this.alertService.showAlert('Ops! Digite um e-mail válido.', '', '');
        break;
      case 'auth/user-disabled':
        this.alertService.showAlert('Ops! Seu acesso foi desativado.', '', '');

      case 'auth/user-not-found':
        this.alertService.showAlert(
          'Ops! Esse e-mail ainda não foi cadastrado.',
          '',
          ''
        );

        break;
      case 'auth/wrong-password':
        this.alertService.showAlert(
          'Ops! Seu e-mail ou senha não batem. Verifique e tente novamente.',
          '',
          ''
        );

        break;
      case 'auth/email-not-verified':
        this.alertService.showAlert(
          'Ops! Seu e-mail ainda não foi verificado, enviamos um e-email de verificação para você.',
          '',
          ''
        );

        break;
      case 'auth/too-many-requests':
        this.alertService.showAlert(
          'Ops! Por excesso de tentativas essa conta foi temporariamente bloqueada. Tente mais tarde.',
          '',
          ''
        );

        break;
      default:
        this.alertService.showAlert(
          'Ops! Algo saiu errado. Verifique sua conexão.',
          '',
          ''
        );
    }
  }

  // -> Sair da conta
  singOutAccount() {
    this.fireAuth.signOut().then(() => {
      this.navCtrl.navigateBack('init-section');
    });
  }
}
