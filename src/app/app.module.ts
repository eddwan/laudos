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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ConfigService, ModelosService } from './services/config.service';

@NgModule({
  declarations: [AppComponent, MainToolBarComponent, ConfirmationDialogComponent],
  entryComponents: [ConfirmationDialogComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    NgxElectronModule, 
    BrowserAnimationsModule, 
    MaterialModule, 
    HttpClientModule, 
    NgxFileHelpersModule,
    FormsModule, 
    ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    HttpErrorHandler,
    MessageService,
    ConfigService,
    ModelosService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
