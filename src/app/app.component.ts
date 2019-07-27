import { Component, NgZone, OnInit } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { ipcRenderer } from 'electron';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.initializeApp()  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }
    })
  }

  ngOnInit() {
    ipcRenderer.on('navigate-to', (event, arg) => {
        this.ngZone.run(() => {
            this.router.navigate([arg, {}]);
        });
    });
}
}
