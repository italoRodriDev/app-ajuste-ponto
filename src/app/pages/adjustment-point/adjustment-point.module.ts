import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdjustmentPointPageRoutingModule } from './adjustment-point-routing.module';

import { AdjustmentPointPage } from './adjustment-point.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdjustmentPointPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdjustmentPointPage]
})
export class AdjustmentPointPageModule {}
