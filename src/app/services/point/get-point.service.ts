import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject } from 'rxjs';
import { Point } from 'src/app/models/point';
import { User } from 'src/app/models/user';
import { PointUserDay } from './../../models/point-user-day';
import { AlertsService } from './../utils/alerts/alerts.service';

@Injectable({
  providedIn: 'root',
})
export class GetPointService {
  db = this.fireDatabase.database;
  private bsDataPoint = new BehaviorSubject<PointUserDay>(null);
  dataPointDay = this.bsDataPoint.asObservable();
  private bsPoint = new BehaviorSubject<Array<Point>>([]);
  listPointsDay = this.bsPoint.asObservable();
  private bsAllPoints = new BehaviorSubject<Array<PointUserDay>>([]);
  listAllPoints = this.bsAllPoints.asObservable();

  constructor(
    private fireDatabase: AngularFireDatabase,
    private alertService: AlertsService
  ) {}

  // - Recuperando dados do ponto
  getDataPointDayUser(idPoint, userData: User) {
    this.alertService.showLoadig().then((loading) => {
      loading.present();
      this.db
        .ref('pointUser')
        .child(idPoint)
        .child(userData?.idUser)
        .on('value', (snapshot) => {
          const data = snapshot.val();

          if (data) {
            this.bsDataPoint.next(null);
            this.bsDataPoint.next(data);
            this.getAllPointsDay(idPoint, userData);
          }
          loading.dismiss();
        });
    });
  }

  // -> Recuperando pontos batidos
  getAllPointsDay(idPointDay, userData: User) {
    this.alertService.showLoadig().then((loading) => {
      loading.present();
      this.db
        .ref('pointsDay')
        .child(idPointDay)
        .child(userData?.idUser)
        .on('value', (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const array = Object.keys(data).map((index) => data[index]);
            this.bsPoint.next([]);
            this.bsPoint.next(array);
          }
          loading.dismiss();
        });
    });
  }

  // -> Recuperando ponto de todos os usuario
  getPointAllUsers(idDate, userData: User) {
    this.db
      .ref('pointUser')
      .child(idDate)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const array = Object.keys(data).map((index) => data[index]);

          this.bsAllPoints.next([]);
          this.bsAllPoints.next(array);
        }
      });
  }
}
