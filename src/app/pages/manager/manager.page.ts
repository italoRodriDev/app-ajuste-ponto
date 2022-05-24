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

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {
  adjSubscription: Subscription;
  dateSelected: string;
  listAdjustment: Array<PointAdjustment> = [];
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
    private adjustmentService: AdjustmentPointService,
    private changeDetector: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private alertService: AlertsService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getDataService();
  }

  getDataService() {
    this.adjSubscription = this.adjustmentService.listAdjustment.subscribe(
      (listAdjustment) => {
        this.cleanList();
        this.listAdjustment = listAdjustment;
      }
    );
  }

  onSelectDate(ev) {
    const value = ev.detail.value;
    if (value) {
      this.cleanList();
      this.dateSelected = value;
      const date = moment(value).format('DDMMYYYY');
      this.adjustmentService.getAllAdjustment(date, null);
    }
  }

  onChangeStatus(ev) {
    const status = ev.detail.value;
    const dateSelected = this.dateSelected;
    if (status && dateSelected) {
      this.adjustmentService.getAllAdjustment(dateSelected, status);
    } else {
      this.alertService.showToast('Selecione uma data primeiro!');
    }
  }

  async onClickDetailAdjustment(itemList) {
    const modal = await this.modalCtrl.create({
      component: DetailAdjustmentPage,
      componentProps: { data: itemList },
      mode: 'ios',
    });
    await modal.present();
  }

  async showModalSettings() {
    const modal = await this.modalCtrl.create({
      component: ConfigPage,
      mode: 'ios',
    });
    await modal.present();
  }

  cleanList() {
    while (this.listAdjustment.length) {
      this.listAdjustment.pop();
      this.changeDetector.detectChanges();
    }
  }
}
