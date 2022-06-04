import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup } from '@angular/forms';
import { UserService } from './../../services/user/user.service';
import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { Subscription } from 'rxjs';
import { ConfigService } from './../../services/config/config.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { IonInput, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  formDataUser: FormGroup = this.formService.formDataUser;
  dataUser: User;
  dataManager: User;
  listManagers: Array<User> = [];
  listManagersFilter: Array<User> = [];

  dataUserSubs: Subscription;
  managerSubs: Subscription;

  constructor(
    private userService: UserService,
    private formService: FormsService,
    private configService: ConfigService,
    private alertService: AlertsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getDataService();
  }

  // -> Recuperando dados do servico
  getDataService() {
    this.dataUserSubs = this.userService.dataUser.subscribe((data) => {
      this.dataUser = data;
      this.formDataUser.patchValue({
        name: data?.name,
        identification: data?.identification,
      });
      this.configInitMangers();
    });

    this.managerSubs = this.configService.listManagers.subscribe(
      (listManagers) => {
        this.listManagers = listManagers;
        this.listManagersFilter = listManagers;
      }
    );
  }

  // -> Config iniciais
  configInitMangers() {
    const manager = this.dataUser?.manager;

    if (manager != null) {
      this.dataManager = manager;
    }
  }

  // -> Ouvido eventos do searchbar
  onChangeSearch(ev) {
    const value = ev.detail.value;

    if (value && value !== '') {
      this.listManagers = this.listManagersFilter.filter(
        (e) => e.userName.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
      );
    } else {
      this.listManagers = this.listManagersFilter;
    }
  }

  // -> Ouvindo radiogroup da lista de gestores
  onChangeRadioGroupManagers(ev) {
    const value = ev.detail.value;
    if (value) {
      this.dataManager = value;
    }
  }

  // -> Salvando dados do usuario
  onClickSaveDataUser() {
    const name = this.formDataUser.controls.name.value;
    const identification = this.formDataUser.controls.identification.value;
    const typeUser = this.dataUser.typeUser;
    const idUser = this.dataUser.idUser;

    const dataUser = new User({
      idUser: idUser,
      name: name,
      typeUser: typeUser,
      identification: identification,
    });

    this.userService.updateDataUser(dataUser);
  }

  // -> Salvar dados do gestor do colaborador
  onClickSaveDataManager() {
    if (this.dataUser) {
      if (this.dataManager) {
        this.userService.updateDataManagerUser(this.dataUser, this.dataManager);
      } else {
        this.alertService.showAlert(
          'Ops! Selecione um gestor.',
          'Falta selecionar seu gestor.',
          ''
        );
      }
    } else {
      this.alertService.showAlert(
        'Ops! Algo saiu errado.',
        'Não encontramos seus dados.',
        ''
      );
    }
  }

  // -> Voltar
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
