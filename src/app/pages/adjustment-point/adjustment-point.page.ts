import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import { IonContent, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Point } from 'src/app/models/point';
import { User } from 'src/app/models/user';
import { FormsService } from 'src/app/services/forms/forms.service';
import { AdjustmentPointService } from 'src/app/services/point/adjustment-point.service';
import { TypePointAdjustment } from './../../enums/type-point-adjustment';
import { TypeUser } from './../../enums/type-user';
import { PointUserDay } from './../../models/point-user-day';
import { UserService } from './../../services/user/user.service';
import { AlertsService } from './../../services/utils/alerts/alerts.service';

@Component({
  selector: 'app-adjustment-point',
  templateUrl: './adjustment-point.page.html',
  styleUrls: ['./adjustment-point.page.scss'],
})
export class AdjustmentPointPage implements OnInit {
  @Input() jorneyDay: PointUserDay;
  @Input() listPointsJorney: Array<Point>;

  @ViewChild(IonContent) ionContent: IonContent;

  formAdjustment: FormGroup = this.formService.formAdjustmentPoint;
  dataTimeValue: string;
  dataUser: User;
  currentDate: string = moment().format();
  userSubscription: Subscription;
  listTypePoints: Array<TypePointAdjustment> = [
    TypePointAdjustment.ENTRADA_SAIDA,
    TypePointAdjustment.PRIMEIRA_PAUSA_DESCANSO,
    TypePointAdjustment.REFEICAO,
    TypePointAdjustment.SEGUNDA_PAUSA_DESCANSO,
  ];
  listAdjustment: Array<any> = [];

  constructor(
    private fireDatabase: AngularFireDatabase,
    private formService: FormsService,
    private userService: UserService,
    private alertService: AlertsService,
    private modalCtrl: ModalController,
    private adjustmentService: AdjustmentPointService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.confiInit();
    this.getDataService();
  }

  // -> Config. iniciais
  confiInit() {
    this.formAdjustment.patchValue({
      nameUser: this.jorneyDay?.user?.name,
      hourStart: this.currentDate,
      hourEnd: this.currentDate,
    });
  }

  // -> Recuperando dados do servico
  getDataService() {
    this.userSubscription = this.userService.dataUser.subscribe(
      (userData) => (this.dataUser = userData)
    );
  }

  // -> Clique em adicionar ajuste
  onClickAdd() {
    this.formAdjustment.patchValue({
      id: this.fireDatabase.createPushId(),
    });
    this.listAdjustment.push(this.formAdjustment.value);
    this.ionContent.scrollToBottom();
  }

  onClickRemoveList(item) {
    const itemFilter = this.listAdjustment.find((el) => el == item);
    if (itemFilter) {
      const index = this.listAdjustment.indexOf(itemFilter);
      this.listAdjustment.splice(index, 1);
    }
  }

  // -> Clique em ver evidencia
  onClickViewEvidence(url) {
    navigator.clipboard.writeText(url).then(() => {
      window.open(url, 'blank');
    });
  }

  // -> Clique em enviar
  onClickSend() {
    if (this.listAdjustment.length) {
      this.adjustmentService.saveDataAdjustment(
        TypeUser.GESTOR,
        this.dataUser,
        this.listAdjustment
      );
      this.onDismiss();
    } else {
      this.alertService.showToast('Adicione ajustes primeiro antes de enviar.');
    }
  }

  // -> Voltar
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
