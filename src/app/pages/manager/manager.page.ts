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
  listAdjustment: Array<PointAdjustment> = [];

  constructor(
    private adjustmentService: AdjustmentPointService,
    private changeDetector: ChangeDetectorRef
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
      const date = moment(value).format('DDMMYYYY');
      this.adjustmentService.getAllAdjustment(date);
    }
  }

  // -> Clique em ver evidencia
  onClickViewEvidence(url) {
    navigator.clipboard.writeText(url).then(() => {
      window.open(url, 'blank');
    });
  }

  cleanList() {
    while (this.listAdjustment.length) {
      this.listAdjustment.pop();
      this.changeDetector.detectChanges();
    }
  }
}
