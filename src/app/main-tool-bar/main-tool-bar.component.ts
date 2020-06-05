import { Component, OnInit, SkipSelf } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema, Empresa } from '../models/config';
import { BROWSER_STORAGE, BrowserStorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
  providers: [
    BrowserStorageService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }
  ]
})
export class MainToolBarComponent implements OnInit {
  online: boolean = false;
  sistema: Sistema;
  empresa: Empresa;
  isLoggedIn = false;
  user: { id: string; username: string; email: string, name: string };
  
  constructor(
    private config:ConfigService,
    private authService:AuthService,
    @SkipSelf() private localStorageService: BrowserStorageService
    ){
    this.sistema = this.config.getData("sistema")
    this.empresa = this.config.getData("empresa")
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => (this.isLoggedIn = isLoggedIn)
    );

    this.authService.auth$.subscribe(({ id, username, email,name }) => {
      this.user = { id, username, email, name };
    });
    
    this.online = remote.getGlobal("isOnline")
    ipcRenderer.on('online-status', (event,arg)=>{
      this.online = <boolean>arg
    })
  }

  btnExit(){
    remote.app.quit();
  }

}
