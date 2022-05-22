import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { PointUserDay } from './../../models/point-user-day';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { SetPointService } from './../../services/point/set-point.service';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { GetPointService } from 'src/app/services/point/get-point.service';
import { Point } from 'src/app/models/point';
import { TypePoint } from 'src/app/enums/type-point';
import { IonButton, IonSelect } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonSelect) ionSelectStatus: IonSelect;
  @ViewChild('ionButtonVoltarPausa') ionButtonBackBreak: IonButton;
  @ViewChild('ionButtonBaterPonto') ionButtonSetPoint: IonButton;

  userSubs: Subscription;
  userPointSubs: Subscription;
  pointSubs: Subscription;
  dataPoint: PointUserDay;
  dataUser: User;
  isEnablePoint: boolean;
  listPoints: Array<Point> = [];
  listTypePoints: Array<TypePoint> = [
    TypePoint.ENTRADA,
    TypePoint.PAUSA,
    TypePoint.REFEICAO,
    TypePoint.SAIDA,
  ];
  currentStatus: String;
  loggedTime: String;
  greetingDay: String;
  currentDate = moment().format();

  constructor(
    private authService: AuthService,
    private alertService: AlertsService,
    private setPointService: SetPointService,
    private getPointService: GetPointService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ionViewDidEnter() {
    this.ionSelectStatus.disabled = true;
    this.getDataService();
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.userPointSubs.unsubscribe();
    this.pointSubs.unsubscribe();
  }

  // -> Recuperando dados do servico
  getDataService() {
    this.getMessegeTimeDay();
    this.userSubs = this.authService.dataUser.subscribe((data: User) => {
      this.dataUser = data;
    });

    this.userPointSubs = this.getPointService.dataPointDay.subscribe(
      (data: PointUserDay) => {
        this.resetDataDayPoints();
        this.dataPoint = data;
      }
    );

    this.pointSubs = this.getPointService.listPointsDay.subscribe(
      (listPoints) => {
        this.listPoints = listPoints;
        this.configStatus();
        this.changeDetector.detectChanges();
      }
    );
  }

  // -> Removendo status
  configStatus() {
    setInterval(() => {
      this.listTypePoints = [
        TypePoint.ENTRADA,
        TypePoint.PAUSA,
        TypePoint.REFEICAO,
        TypePoint.SAIDA,
      ];

      if (!this.dataPoint) {
        this.removeItemStatus(TypePoint.REFEICAO);
        this.removeItemStatus(TypePoint.PAUSA);
        this.removeItemStatus(TypePoint.SAIDA);
      }

      this.listPoints.forEach((el, index) => {
        switch (el.status) {
          case TypePoint.ENTRADA:
            this.removeItemStatus(TypePoint.ENTRADA);
            break;
          case TypePoint.REFEICAO:
            this.removeItemStatus(TypePoint.REFEICAO);
            break;
          case TypePoint.SAIDA:
            this.removeItemStatus(TypePoint.SAIDA);
            break;
        }

        this.currentStatus = el.status;
      });
      this.validatePermissionClickButton();

      if (this.listPoints.length) {
        // -> Validando diferenca de horas
        const dateInitPoint = this.listPoints[0]?.hourPoint;
        this.getTimeDiff(dateInitPoint);
      }
    }, 3000);
  }

  // -> Diferença do momento atual para o inicio da jornada
  getTimeDiff(hourPoint) {
    if (hourPoint) {
      var duration = moment.duration(
        moment(moment().format()).diff(moment(hourPoint).format())
      );
      const hours = duration.hours();
      const minutes = duration.minutes();

      const fullTime = parseInt(hours.toString()) + 'h:' + minutes + 'min';
      this.loggedTime = fullTime;
    }
  }

  // -> Validando permisao de clique nos botoes
  validatePermissionClickButton() {
    if (
      this.currentStatus == TypePoint.PAUSA ||
      this.currentStatus == TypePoint.REFEICAO
    ) {
      this.ionButtonBackBreak.disabled = false;
      this.ionButtonSetPoint.disabled = true;
    } else {
      this.ionButtonBackBreak.disabled = true;
      this.ionButtonSetPoint.disabled = false;
    }

    if (this.currentStatus != TypePoint.PAUSA) {
      if (this.currentStatus != TypePoint.REFEICAO) {
        if (this.currentStatus == TypePoint.SAIDA) {
          this.ionButtonSetPoint.disabled = true;
        } else {
          this.ionButtonSetPoint.disabled = false;
        }
      }
    }
  }

  // -> Removendo item da lista de tipos de status
  removeItemStatus(status: TypePoint) {
    const INDEX = this.listTypePoints.indexOf(status);
    this.listTypePoints.splice(INDEX, 1);
  }

  // -> Ouvindo select de status
  onChangeStatus(ev) {
    const status = ev.detail.value;
    if (status) {
      this.setPointService.setPointUserInitJorney(this.dataUser, status);
      this.ionSelectStatus.disabled = true;
    }
  }

  // -> Clique em bater ponto
  onClickBaterPonto() {
    this.ionSelectStatus.disabled = false;
    setTimeout(() => {
      this.ionSelectStatus.open();
    }, 200);
  }

  // -> Clique em voltar da pausa
  onClickVoltarPausa() {
    this.setPointService.setPointUserInitJorney(
      this.dataUser,
      TypePoint.VOLTA_PAUSA
    );
    this.ionSelectStatus.disabled = true;
  }

  // -> Botao proxima pagina de ponto
  onClickButtonNextAndBackPage(typeClick) {
    // -> Data atual
    const today = moment(this.currentDate);
    // -> Próxima data
    const tomorrow = moment(this.currentDate).add(1, 'days');
    // -> Data anterior
    const yesterday = moment(this.currentDate)
      .subtract(1, 'days')
      .startOf('day');

    switch (typeClick) {
      case 'BACK':
        const filterYesterday = moment(yesterday).format('DDMMYYYY').toString();
        this.getPointService.getDataPointDayUser(
          filterYesterday,
          this.dataUser
        );
        this.currentDate = moment(yesterday).format();
        this.resetDataDayPoints();
        this.changeDetector.detectChanges();

        break;
      case 'NEXT':
        const filterTomorrow = moment(tomorrow).format('DDMMYYYY').toString();
        this.getPointService.getDataPointDayUser(filterTomorrow, this.dataUser);
        this.currentDate = moment(tomorrow).format();
        this.resetDataDayPoints();
        this.changeDetector.detectChanges();

        break;
    }
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

  // -> Resetando ponto
  resetDataDayPoints() {
    this.dataPoint = null;
    while (this.listPoints.length) {
      this.listPoints.pop();
    }
    this.configStatus();
  }
}
