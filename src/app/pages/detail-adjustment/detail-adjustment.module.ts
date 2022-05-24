import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailAdjustmentPageRoutingModule } from './detail-adjustment-routing.module';

import { DetailAdjustmentPage } from './detail-adjustment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailAdjustmentPageRoutingModule
  ],
  declarations: [DetailAdjustmentPage]
})
export class DetailAdjustmentPageModule {}
