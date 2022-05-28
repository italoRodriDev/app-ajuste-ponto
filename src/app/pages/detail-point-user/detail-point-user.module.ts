import { SharedComponentsModule } from './../../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPointUserPageRoutingModule } from './detail-point-user-routing.module';

import { DetailPointUserPage } from './detail-point-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPointUserPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [DetailPointUserPage]
})
export class DetailPointUserPageModule {}
