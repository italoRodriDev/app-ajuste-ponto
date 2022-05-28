import { SetPointService } from './../../services/point/set-point.service';
import { ModalController, AlertController } from '@ionic/angular';
import { PointUserDay } from 'src/app/models/point-user-day';
import { Component, Input, OnInit } from '@angular/core';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-detail-point-user',
  templateUrl: './detail-point-user.page.html',
  styleUrls: ['./detail-point-user.page.scss'],
})
export class DetailPointUserPage implements OnInit {
  @Input() data: PointUserDay;
  @Input() listPoints: Array<Point>;

  constructor(
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {}

  // -> Voltar
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
