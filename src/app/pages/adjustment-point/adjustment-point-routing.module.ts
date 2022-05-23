import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdjustmentPointPage } from './adjustment-point.page';

const routes: Routes = [
  {
    path: '',
    component: AdjustmentPointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdjustmentPointPageRoutingModule {}
