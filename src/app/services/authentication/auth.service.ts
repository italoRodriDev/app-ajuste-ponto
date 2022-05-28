import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FormsService } from '../forms/forms.service';
import { User } from './../../models/user';
import { UserService } from './../user/user.service';
import { AlertsService } from './../utils/alerts/alerts.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  db = this.fireDatabase.database;
  formSign: FormGroup = this.formsService.formSign;
  formSignUp: FormGroup = this.formsService.formSignUp;
  token: boolean = false;
  idUser: string;

  constructor(
    private formsService: FormsService,
    private alertService: AlertsService,
    private userService: UserService,
    private fireAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase,
    private navCtrl: NavController
  ) {}

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

          this.userService.saveDataUser(dataUser);
          this.userService.validateTypeUser(dataUser.typeUser);
          resolve();
        })
        .catch((error) => {
          this.validateErrorAuth(error.code);
        });
    });
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
      this.navCtrl.navigateBack('login');
    });
  }
}
