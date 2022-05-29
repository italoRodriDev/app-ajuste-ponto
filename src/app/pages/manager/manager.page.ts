import { UserService } from './../../services/user/user.service';
import { AuthService } from './../../services/authentication/auth.service';
import { GetPointService } from 'src/app/services/point/get-point.service';
import { ConfigPage } from './../config/config.page';
import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { TypeStatusAdjustment } from './../../enums/type-status-adjustment-pont';
import { DetailAdjustmentPage } from './../detail-adjustment/detail-adjustment.page';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AdjustmentPointService } from './../../services/point/adjustment-point.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PointAdjustment } from 'src/app/models/point-adjustment';
import * as moment from 'moment';
import { PointUserDay } from 'src/app/models/point-user-day';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {
  userSubs: Subscription;
  allPointsSubs: Subscription;
  adjSubs: Subscription;
  dataUser: User;
  dateSelected: string;
  greetingDay: String;

  currentDate = moment().format('DDMMYYYY');
  listAdjustment: Array<PointAdjustment> = [];
  listAdjustmentFilter: Array<PointAdjustment> = [];
  listAllPoints: Array<PointUserDay> = [];
  listTypeStatus: Array<TypeStatusAdjustment> = [
    TypeStatusAdjustment.ENVIADO,
    TypeStatusAdjustment.EM_ANALISE,
    TypeStatusAdjustment.ERRO_EVIDENCIA,
    TypeStatusAdjustment.OUTRO_ERRO,
    TypeStatusAdjustment.REFAZER,
    TypeStatusAdjustment.APROVADO,
    TypeStatusAdjustment.NEGADO,
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private adjustmentService: AdjustmentPointService,
    private getPointService: GetPointService,
    private changeDetector: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private alertService: AlertsService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.adjSubs.unsubscribe();
    this.allPointsSubs.unsubscribe();
  }

  ionViewDidEnter() {
    this.getDataService();
    this.getMessegeTimeDay();
  }

  // -> Mostrando saudacao de horas do dia
  getMessegeTimeDay() {
    const hour = moment().hour();
    const timeDay = moment().format('a');

    switch (timeDay) {
      case 'am':
        if (hour >= 0 && hour <= 6) {
          this.greetingDay = 'Boa madrugada!';
        } else if (hour >= 6 && hour <= 12) {
          this.greetingDay = 'Bom dia!';
        }
        break;

      case 'pm':
        if (hour >= 12 && hour <= 18) {
          this.greetingDay = 'Boa tarde!';
        } else if (hour >= 18 && hour <= 23) {
          this.greetingDay = 'Boa noite';
        }
        break;
    }
  }

  // -> Recuperando dados do servico
  getDataService() {
    this.userSubs = this.userService.dataUser.subscribe((data) => {
      this.dataUser = data;
      this.getPointService.getPointAllUsers(this.currentDate, this.dataUser);
    });

    this.adjSubs = this.adjustmentService.listAdjustment.subscribe(
      (listAdjustment) => {
        this.cleanList('AJUSTES_PONTO');
        this.listAdjustment = listAdjustment;
        this.listAdjustmentFilter = listAdjustment;
        this.changeDetector.detectChanges();
      }
    );
    this.allPointsSubs = this.getPointService.listAllPoints.subscribe(
      (listAllPoints) => {
        this.cleanList('PONTOS_DIA');
        this.listAllPoints = listAllPoints;
        this.changeDetector.detectChanges();
      }
    );
  }

  // -> Selecionando data
  onSelectDate(ev) {
    const value = ev.detail.value;
    if (value) {
      this.dateSelected = value;
      const date = moment(value).format('DDMMYYYY');
      this.adjustmentService.getAllAdjustment(date, null);
      this.getPointService.getPointAllUsers(date, this.dataUser);
      this.cleanList('AJUSTES_PONTO');
    }
  }

  // -> Selecionando status
  onChangeStatus(ev) {
    const status = ev.detail.value;
    const dateSelected = this.dateSelected;
    if (status && dateSelected) {
      this.adjustmentService.getAllAdjustment(dateSelected, status);
    } else {
      this.alertService.showToast('Selecione uma data primeiro!');
    }
  }

  // -> Pesquisando ajustes de ponto
  onSearchAdjustment(ev) {
    const value = ev.detail.value;

    if (value && value !== '') {
      this.listAdjustment = this.listAdjustmentFilter.filter(
        (el) =>
          el.user.name.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
      );
    } else {
      this.listAdjustment = this.listAdjustmentFilter;
    }
  }

  // -> Clique em mostrar detalhes do ajuste
  async onClickDetailAdjustment(itemList) {
   
    const modal = await this.modalCtrl.create({
      component: DetailAdjustmentPage,
      componentProps: { data: itemList },
      mode: 'ios'
    });
    await modal.present();
  }

  // -> Mostrar configuracoes
  async showModalSettings() {
    const modal = await this.modalCtrl.create({
      component: ConfigPage,
      mode: 'ios',
    });
    await modal.present();
  }

  // -> Limpando listas
  cleanList(type) {

    switch(type){
      case 'AJUSTES_PONTO':
        while (this.listAdjustment.length) {
          this.listAdjustment.pop();
          this.changeDetector.detectChanges();
        }
        break;
      case 'PONTOS_DIA':
        while (this.listAllPoints.length) {
          this.listAllPoints.pop();
          this.changeDetector.detectChanges();
        }
        break;  
    }
    
  }

  // -> Clique em sair da conta
  onClickExit() {
    this.authService.singOutAccount();
  }
}
