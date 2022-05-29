import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { AdjustmentPointService } from 'src/app/services/point/adjustment-point.service';
import { TypeStatusAdjustment } from './../../enums/type-status-adjustment-pont';

@Component({
  selector: 'app-detail-adjustment',
  templateUrl: './detail-adjustment.page.html',
  styleUrls: ['./detail-adjustment.page.scss'],
})
export class DetailAdjustmentPage implements OnInit {
  @ViewChild(IonSelect) ionSelectStatus: IonSelect;
  @Input() data;
  listTypeStatus: Array<any> = [
    TypeStatusAdjustment.EM_ANALISE,
    TypeStatusAdjustment.ERRO_EVIDENCIA,
    TypeStatusAdjustment.OUTRO_ERRO,
    TypeStatusAdjustment.REFAZER,
    TypeStatusAdjustment.APROVADO,
    TypeStatusAdjustment.NEGADO,
  ];

  constructor(
    private adjustmentPointService: AdjustmentPointService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  // -> Clique em ver evidencia
  onClickViewEvidence(url) {
    navigator.clipboard.writeText(url).then(() => {
      window.open(url, 'blank');
    });
  }

  onChangeStatus(ev) {
    const status = ev.detail.value;
    const dataUser = this.data?.user;
    const dataAdj = this.data;
    if (status && dataUser) {
      this.adjustmentPointService.updateStatusAdjustment(
        dataAdj,
        dataUser,
        status
      );
    }
  }

  // -> Clique em atualizar estatus
  onClickUpdateStatus() {
    this.ionSelectStatus.open();
  }

  // -> Voltar
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
