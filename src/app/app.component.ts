import { Component, NgZone, OnInit, SkipSelf } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { ipcRenderer } from 'electron';
import { Router } from '@angular/router';
import { SyncServices } from './services/sync.services';
import { ConfigService, authStorageService } from './services/config.service';
import { Sistema } from './models/config';
import { interval } from 'rxjs';
import { AmplifyService }  from 'aws-amplify-angular';
import { Auth, Hub } from 'aws-amplify';
import { BROWSER_STORAGE, BrowserStorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    BrowserStorageService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ]
})
export class AppComponent implements OnInit {
  currentUser: any
  isLoggedIn: boolean = false
  sistema: Sistema

  constructor(
    public amplify:AmplifyService,
    private authStorage:authStorageService,
    private syncService:SyncServices,
    private configService:ConfigService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ngZone: NgZone,
    private router: Router,
    private authService:AuthService,
    @SkipSelf() private localStorageService: BrowserStorageService
    ) {
      // observa o estado do usuário
      this.amplify.authStateChange$.subscribe(authState => {
        // caso o estado do usuario esteja deslogado
        if(authState.state == "signedOut"){
          // define o localstorage como signedout
          this.localStorageService.set('signedIn', 'false')
          // obtem os dados da sessão armazenados em disco
          this.currentUser = this.authStorage.getAll()
          console.log(this.currentUser)
          console.log(this.authService.validarToken(this.currentUser.user.signInUserSession.idToken.jwtToken))
          // caso haja informação do storage
          if(Object.entries(this.currentUser.user.storage).length > 1){
            // transfere os dados do disco para o localstorage do electron Browser window
            Object.entries(this.currentUser.user.storage).forEach( (element) => {
              this.localStorageService.set(element[0], <string>element[1])
            })
            console.log(this.currentUser.user.signInUserSession.idToken.jwtToken)
            this.authService.validarToken(this.currentUser.user.signInUserSession.idToken.jwtToken)
            // Autentica o usuário
            Auth.currentAuthenticatedUser().then( user =>{
              
              this.localStorageService.set('signedIn', 'true')
            }).catch(err => {
              this.router.navigate(['/login'], { replaceUrl: true });
            })
          }
        }
        if(authState.state == "signedIn"){
          this.authStorage.saveObject({user: authState.user})
          this.localStorageService.set('signedIn', 'true')
        }
        // console.log('authState', authState);
      });

      this.sistema = this.configService.getData("sistema")
      this.initializeApp()
      // Used for listening to login events
      // Hub.listen("auth", ({ payload: { event, data } }) => {
      //   console.log(event);
      //   if (event === "signIn") {
      //     Auth.currentAuthenticatedUser().then(user => {
      //       this.authStorage.saveObject({user: user})
      //     }).catch( error => console.error(error))
          
      //   }
      // });
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
        ipcRenderer.on('navigate-to', (event, arg) => {
          this.ngZone.run(() => {
            this.router.navigate([arg, {}]);
          });
        });
      }
    }
    