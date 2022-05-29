import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from './../../components/shared-components.module';
import { DetailAdjustmentPageRoutingModule } from './detail-adjustment-routing.module';
import { DetailAdjustmentPage } from './detail-adjustment.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailAdjustmentPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [DetailAdjustmentPage]
})
export class DetailAdjustmentPageModule {}
