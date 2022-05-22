import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { Subscription } from 'rxjs';
import { ConfigService } from './../../services/config/config.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  dataUser: User;
  dataManager: User;
  listManagers: Array<User> = [];
  listManagersFilter: Array<User> = [];

  dataUserSubs: Subscription;
  managerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private alertService: AlertsService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getDataService();
  }

  // -> Recuperando dados do servico
  getDataService() {
    this.dataUserSubs = this.authService.dataUser.subscribe((data) => {
      this.dataUser = data;
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

  // -> Salvar
  onClickSave() {
    if (this.dataUser) {
      if (this.dataManager) {
        this.authService.updateDataUser(this.dataUser, this.dataManager);
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
}
