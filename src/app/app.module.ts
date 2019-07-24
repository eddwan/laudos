import 'hammerjs';

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { NgxElectronModule } from 'ngx-electron'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http'
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { MaterialModule } from './material.module'
import { MainToolBarComponent} from './main-tool-bar/main-tool-bar.component'
import { NgxFileHelpersModule } from 'ngx-file-helpers';

@NgModule({
  declarations: [AppComponent, MainToolBarComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxElectronModule, BrowserAnimationsModule, MaterialModule, HttpClientModule, NgxFileHelpersModule],
  providers: [
    StatusBar,
    SplashScreen,
    HttpErrorHandler,
    MessageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
