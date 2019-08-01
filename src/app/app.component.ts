import { Component, NgZone, OnInit } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { ipcRenderer } from 'electron';
import { Router } from '@angular/router';
import { SyncServices } from './services/sync.services';
import { ConfigService } from './services/config.service';
import { Sistema } from './models/config';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  sistema: Sistema

  constructor(
    private syncService:SyncServices,
    private configService:ConfigService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.sistema = this.configService.getData("sistema")
    this.initializeApp()  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }
    })

    // if(this.sistema.cloud.autoSync){
    //   interval(10000).subscribe( res =>
    //     this.syncService.synchronize()
    //   )
    // }
  }

  ngOnInit() {
    ipcRenderer.on('navigate-to', (event, arg) => {
        this.ngZone.run(() => {
            this.router.navigate([arg, {}]);
        });
    });
}
}
