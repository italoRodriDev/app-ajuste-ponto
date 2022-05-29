import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailMyPointsPage } from './detail-my-points.page';

const routes: Routes = [
  {
    path: '',
    component: DetailMyPointsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailMyPointsPageRoutingModule {}
