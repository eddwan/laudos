import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema } from '../models/config';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit {
  online: boolean;
  sistema: Sistema;

  constructor(private config:ConfigService){
    this.sistema = this.config.getData("sistema")
  }

  ngOnInit() {
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }

}
