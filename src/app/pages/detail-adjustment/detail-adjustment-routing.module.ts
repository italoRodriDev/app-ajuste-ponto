import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailAdjustmentPage } from './detail-adjustment.page';

const routes: Routes = [
  {
    path: '',
    component: DetailAdjustmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailAdjustmentPageRoutingModule {}
