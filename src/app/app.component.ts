import { Component, NgZone, OnInit, SkipSelf } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { ipcRenderer } from 'electron';
import { Router } from '@angular/router';
import { SyncServices } from './services/sync.services';
import { ConfigService } from './services/config.service';
import { Sistema } from './models/config';
import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  sistema: Sistema
  isLoggedIn = false;
  user: { id: string; username: string; email: string, name: string };
  
  constructor(
    private syncService:SyncServices,
    private configService:ConfigService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ngZone: NgZone,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService:AuthService,
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
      
      if(this.sistema.cloud.autoSync){
        interval(15000).subscribe( res =>
          this.syncService.synchronize()
          )
        }
      }
      
      ngOnInit() {
        this.authService.isLoggedIn$.subscribe(
          isLoggedIn => {
            this.isLoggedIn = isLoggedIn;
            if(isLoggedIn && this.sistema.cloud.enabled){
              this._snackBar.open("Sessão ativada com sucesso!", "Fechar", {duration: 3000});
              // this.router.navigate(['/'], { replaceUrl: true });
            }else{
              if(this.sistema.cloud.enabled) this._snackBar.open("Sua sessão expirou. É necessário fazer login novamente.", "Fechar", {duration: 5000});
            }
          }
          );
          
          ipcRenderer.on('navigate-to', (event, arg) => {
            this.ngZone.run(() => {
              this.router.navigate([arg, {}]);
            });
          });
        }
      }
      