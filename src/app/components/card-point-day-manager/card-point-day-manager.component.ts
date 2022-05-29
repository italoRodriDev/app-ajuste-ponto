import { DetailPointUserPage } from './../../pages/detail-point-user/detail-point-user.page';
import { ModalController } from '@ionic/angular';
import { PointUserDay } from 'src/app/models/point-user-day';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { GetPointService } from 'src/app/services/point/get-point.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-card-point-day-manager',
  templateUrl: './card-point-day-manager.component.html',
  styleUrls: ['./card-point-day-manager.component.scss'],
})
export class CardPointDayManagerComponent implements OnInit {
  @Input() data: PointUserDay;
  @Input() currentDateID: string;
  subPoits: Subscription;
  toggleBtn: boolean = true;

  db = this.fireDatabase.database;
  listPointsDay: Array<Point> = [];

  private bsPoint = new BehaviorSubject<Array<Point>>([]);
  listPointsDayObs = this.bsPoint.asObservable();

  constructor(
    private modalCtrl: ModalController,
    private fireDatabase: AngularFireDatabase
  ) {}

  ngOnInit() {
    //this.getPointsUser();
  }

  // -> Recuperando dados do servico
  getPointsUser() {
    this.db
      .ref('pointsDay')
      .child(this.currentDateID)
      .child(this.data.idUser)
      .on('value', (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const array = Object.keys(data).map((index) => data[index]);
          this.bsPoint.next([]);
          this.bsPoint.next(array);
          this.addListenner();
        }
      });
  }

  // -> Escutando pontos
  addListenner() {
    this.subPoits = this.listPointsDayObs.subscribe((listPoints) => {
      this.listPointsDay = listPoints;
    });
  }

  // -> Mostrar detalhes
  async onClickShowDetail() {
    const modal = await this.modalCtrl.create({
      component: DetailPointUserPage,
      mode: 'ios',
      componentProps: {
        data: this.data,
        listPoints: this.listPointsDay
      }
    });
    await modal.present();
  }

  // -> Toggle
  onToggle() {
    this.toggleBtn == true ? (this.toggleBtn = false) : (this.toggleBtn = true);
  }
}
