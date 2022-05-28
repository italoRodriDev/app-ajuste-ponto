import { CardAdjustmentManagerComponent } from './card-adjustment-manager/card-adjustment-manager.component';
import { CardPointDayManagerComponent } from './card-point-day-manager/card-point-day-manager.component';
import { CardPointComponent } from './card-point/card-point.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CardPointComponent,
    CardPointDayManagerComponent,
    CardAdjustmentManagerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CardPointComponent,
    CardPointDayManagerComponent,
    CardAdjustmentManagerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentsModule { }
