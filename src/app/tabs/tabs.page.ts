import { Component, OnInit } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema } from '../models/config';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  online: boolean;
  sistema: Sistema;

  constructor(private config:ConfigService){
    this.sistema = this.config.getData("sistema")
  }

  ngOnInit(){
    this.online = remote.getGlobal("isOnline")
    ipcRenderer.on('online-status', (event, arg) => {
      this.online = <boolean>arg
    })
  }
}
