import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
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
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }
}
