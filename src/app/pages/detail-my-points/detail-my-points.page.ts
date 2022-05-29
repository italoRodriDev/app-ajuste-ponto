import { TypeUser } from './../../enums/type-user';
import { AdjustmentPointService } from './../../services/point/adjustment-point.service';
import { SetPointService } from './../../services/point/set-point.service';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import {
  AlertController,
  IonReorderGroup,
  ModalController,
} from '@ionic/angular';
import * as moment from 'moment';
import { TypePoint } from 'src/app/enums/type-point';
import { Point } from 'src/app/models/point';
import { PointUserDay } from 'src/app/models/point-user-day';
import { FormsService } from 'src/app/services/forms/forms.service';
import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-detail-my-points',
  templateUrl: './detail-my-points.page.html',
  styleUrls: ['./detail-my-points.page.scss'],
})
export class DetailMyPointsPage implements OnInit {
  @Input() dataUser: User;
  @Input() jorneyDay: PointUserDay;
  @Input() listPointsJorney: Array<Point>;

  formAddPoint: FormGroup = this.formService.formAddPoint;
  listPointsJorneyReset: Array<Point> = [];

  editPoint: Point;
  originalHourPoint: string;
  toggleNewPoint: boolean = false;
  currentDate = moment().format();
  toggleSave: boolean = false;

  listTypePoints: Array<TypePoint> = [
    TypePoint.ENTRADA,
    TypePoint.PAUSA,
    TypePoint.REFEICAO,
    TypePoint.SAIDA,
  ];

  constructor(
    private formService: FormsService,
    private fireDatabase: AngularFireDatabase,
    private changeDetector: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private alertService: AlertsService,
    private modalCtrl: ModalController,
    private adjustmentPointService: AdjustmentPointService
  ) {}

  ngOnInit() {
    this.listPointsJorneyReset = this.listPointsJorney;
  }

  // -> Click no ponto
  async onClickPoint(dataPoint: Point) {
    if (!this.editPoint) {
      this.editPoint = dataPoint;
      this.originalHourPoint = dataPoint.hourPoint;
      this.changeDetector.detectChanges();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Já existe um ponto na edição!',
        subHeader: 'Cancele a edição antes de editar outro ponto.',
      });
      await alert.present();
    }
  }

  // -> Recuperando ordems
  doReorder(ev) {
    this.listPointsJorney = ev.detail.complete(this.listPointsJorney);
    this.toggleSave = true;
  }

  // -> Clique em remover ponto
  onClickRemovePoint() {
    this.showAlertConfirmRemove();
  }

  // -> Remover da lista
  removeList() {
    const point = this.editPoint;

    const data = this.listPointsJorney.find(
      (el) => el.idPoint == point.idPoint
    );
    const index = this.listPointsJorney.indexOf(data);
    this.listPointsJorney.splice(index, 1);
  }

  // -> Clique em excluir ajuste
  async showAlertConfirmRemove() {
    const point = this.editPoint;

    const alert = await this.alertCtrl.create({
      header: 'Deseja excluir este ponto?',
      subHeader: 'Ao confirmar o ajuste será salvo.',
      message: 'Escolha uma ação.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },
        {
          text: 'Salvar',
          handler: () => {
            this.removeList();
          },
        },
      ],
    });
    await alert.present();
  }

  // -> Clique em salvar edicao do ponto
  onClickSaveEditPoint() {
    this.showAlertConfirmSave();
  }

  // -> Clique em salvar ajuste
  async showAlertConfirmSave() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja savar esta edição?',
      subHeader: 'Ao confirmar o ajuste será salvo.',
      message: 'Escolha uma ação.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },
        {
          text: 'Salvar',
          handler: () => {
            this.replacePointList();
          },
        },
      ],
    });
    await alert.present();
  }

  // -> Add edicao na lista
  replacePointList() {
    const point = this.editPoint;

    const data = this.listPointsJorney.find(
      (el) => el.idPoint == point.idPoint
    );
    const index = this.listPointsJorney.indexOf(data);
    this.listPointsJorney[index] = point;
    this.editPoint = null;
  }

  // -> Cancelar edicao de ponto
  onClickCancelEditPoint() {
    this.editPoint.hourPoint = this.originalHourPoint;
    this.editPoint = null;
  }

  // -> Toggle novo ponto
  onToggleNewPoint() {
    this.toggleNewPoint == false
      ? (this.toggleNewPoint = true)
      : (this.toggleNewPoint = false);

    if (this.toggleNewPoint == true) {
      const idFire = this.fireDatabase.createPushId();

      this.formAddPoint.patchValue({
        dateDay: this.jorneyDay.dateHour,
        idPoint: idFire,
        idPointUser: this.jorneyDay.idUserPoint,
      });
    } else {
      this.formAddPoint.reset();
    }
  }

  // -> Adicionar ponto
  onClickAddPoint() {
    const newPoint: Point = this.formAddPoint.value;

    if (newPoint) {
      const data: any = this.listPointsJorney.find(
        (el) => el.status == newPoint.status
      );

      const status = data?.status;
      if (status == TypePoint.ENTRADA || status == TypePoint.SAIDA) {
        this.alertService.showAlert(
          'Ops! Não vai ser possível adicionar.',
          `Você já tem um ponto de "${status}" na jornada.`,
          `Exclua o ponto "${status}" antes de adicionar um novo.`
        );
      } else {
        this.listPointsJorney.push(newPoint);
        this.alertService.showAlert(
          'Ponto adicionado com sucesso',
          'Agora ele vai aparecer na jornada.',
          'Você tambê pode reorganizar a ordem caso deseje.'
        );
        this.toggleNewPoint = false;
        this.toggleSave = true;
      }
    }
  }

  // -> Eventos datetime
  onChangeDateTime(ev) {
    const value = ev.detail.value;
    new Promise<void>((resolve) => {
      if (value) {
        this.editPoint.hourPoint = moment(value).format();
        resolve();
      }
    });
  }

  // -> Salvar todos os ajustes
  onClickSaveAllAdjustments() {
    if (this.dataUser && this.listPointsJorney.length) {
      this.showAlertSendOrder();
    } else {
      this.alertService.showToast('Algo saiu errado!');
    }
  }

  // -> Mostrando alerta para enviar solicitacao
  async showAlertSendOrder() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja enviar esta solicitação?',
      subHeader: 'Ao confirmar a solicitação será enviada.',
      message: 'Escolha uma ação.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },
        {
          text: 'Enviar',
          handler: () => {
            this.adjustmentPointService.saveDataAdjustment(
              TypeUser.COLABORADOR,
              this.dataUser,
              this.listPointsJorney
            );
            this.toggleSave = false;
          },
        },
      ],
    });
    await alert.present();
  }

  // -> Voltar
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
