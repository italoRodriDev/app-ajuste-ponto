import { FormBuilder } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const maskConfig: Partial<IConfig> = {
  validation: false
};


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    LazyLoadImageModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,

    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    FormBuilder,
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
