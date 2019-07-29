import { Component, OnInit } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema, Empresa } from '../models/config';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit {
  online: boolean;
  sistema: Sistema;
  empresa: Empresa;
  
  constructor(private config:ConfigService){
    this.sistema = this.config.getData("sistema")
    this.empresa = this.config.getData("empresa")
  }

  ngOnInit() {
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }

  btnExit(){
    remote.getCurrentWindow().close();
  }

}
