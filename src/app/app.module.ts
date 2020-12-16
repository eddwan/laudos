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
import { ConfigService, ModelosService, authStorageService } from './services/config.service';

/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import { AmplifyService } from 'aws-amplify-angular';
import { UserAuthenticationComponent } from './auth/user-authentication.component';
import { AuthService } from './services/auth.service';

import { AvatarModule } from "ngx-avatar";

// import awsconfig from '../aws-exports';
/* Configure Amplify resources */
// Amplify.configure(awsconfig);

@NgModule({
  declarations: [AppComponent, MainToolBarComponent, ConfirmationDialogComponent, UserAuthenticationComponent],
  entryComponents: [ConfirmationDialogComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    NgxElectronModule, 
    BrowserAnimationsModule, 
    MaterialModule, 
    HttpClientModule, 
    AmplifyUIAngularModule,
    NgxFileHelpersModule,
    FormsModule, 
    AvatarModule,
    ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    HttpErrorHandler,
    MessageService,
    ConfigService,
    ModelosService,
    AuthService,
    authStorageService,
    AmplifyService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
