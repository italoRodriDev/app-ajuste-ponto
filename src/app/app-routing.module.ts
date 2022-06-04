import { NgModule } from '@angular/core';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const userNotAuthorized = () => redirectUnauthorizedTo(['loading']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'create-account',
    loadChildren: () =>
      import('./pages/create-account/create-account.module').then(
        (m) => m.CreateAccountPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('./pages/manager/manager.module').then((m) => m.ManagerPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'config',
    loadChildren: () =>
      import('./pages/config/config.module').then((m) => m.ConfigPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'adjustment-point',
    loadChildren: () =>
      import('./pages/adjustment-point/adjustment-point.module').then(
        (m) => m.AdjustmentPointPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'detail-adjustment',
    loadChildren: () =>
      import('./pages/detail-adjustment/detail-adjustment.module').then(
        (m) => m.DetailAdjustmentPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'detail-point-user',
    loadChildren: () =>
      import('./pages/detail-point-user/detail-point-user.module').then(
        (m) => m.DetailPointUserPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
  {
    path: 'detail-my-points',
    loadChildren: () =>
      import('./pages/detail-my-points/detail-my-points.module').then(
        (m) => m.DetailMyPointsPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { userNotAuthorized },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
