import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailMyPointsPageRoutingModule } from './detail-my-points-routing.module';

import { DetailMyPointsPage } from './detail-my-points.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailMyPointsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DetailMyPointsPage]
})
export class DetailMyPointsPageModule {}
