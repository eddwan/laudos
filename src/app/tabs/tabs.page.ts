import { Component, OnInit } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema } from '../models/config';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  isLoggedIn = false;
  online: boolean;
  sistema: Sistema;
  
  constructor(
    private config:ConfigService,
    private authService:AuthService
    ){
      this.sistema = this.config.getData("sistema")
    }
    
    ngOnInit(){

      this.authService.isLoggedIn$.subscribe(
        isLoggedIn => (this.isLoggedIn = isLoggedIn)
        );

      this.online = remote.getGlobal("isOnline")
      ipcRenderer.on('online-status', (event, arg) => {
        this.online = <boolean>arg
      })
    }
  }
  