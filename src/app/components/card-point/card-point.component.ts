import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController, IonDatetime } from '@ionic/angular';
import { Point } from 'src/app/models/point';
import { PointUserDay } from 'src/app/models/point-user-day';
import { User } from 'src/app/models/user';
import { SetPointService } from 'src/app/services/point/set-point.service';

@Component({
  selector: 'app-card-point',
  templateUrl: './card-point.component.html',
  styleUrls: ['./card-point.component.scss'],
})
export class CardPointComponent implements OnInit {
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  @Input() dataUser: User;
  @Input() dataUserPoint: PointUserDay;
  @Input() listPoints;
  @Output() onResetData = new EventEmitter();
  currentDateTime: string;

  constructor(
    private alertCtrl: AlertController,
    private setPointService: SetPointService,
  ) {}

  ngOnInit() {}

  // -> Clique em remover ponto
  onClickRemovePoint(dataPoint) {
    this.showAlertConfirmRemove(dataPoint);
  }

  // -> Clique em salvar edicao do ponto
  onClickSaveEditPoint(dataPoint) {
    this.showAlertConfirmSave(dataPoint);
  }

  // -> Clique em salvar ajuste
  async showAlertConfirmSave(dataPoint: Point) {
    const newDate = this.currentDateTime;

    const alert = await this.alertCtrl.create({
      header: 'Deseja savar está edição?',
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
            this.setPointService.saveAdjustmentPoint(
              this.dataUserPoint,
              dataPoint,
              newDate
            );
            this.onResetData.emit(true);
          },
        },
      ],
    });
    await alert.present();
  }

  // -> Clique em excluir ajuste
  async showAlertConfirmRemove(dataPoint: Point) {
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
            this.setPointService.RemovePointAdjustment(
              this.dataUserPoint,
              dataPoint
            );
            this.onResetData.emit(true);
          },
        },
      ],
    });
    await alert.present();
  }

  // -> Eventos datetime
  onChangeDateTime(ev) {
    const value = ev.detail.value;
    if (value) {
      this.currentDateTime = value;
    }
  }
}
