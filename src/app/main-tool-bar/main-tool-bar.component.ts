import { Component, OnInit } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
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
  isFullScreen: boolean = false;
  
  constructor(private config:ConfigService){
    this.sistema = this.config.getData("sistema")
    remote.getCurrentWindow().removeAllListeners().on("resize",  function(e){
      e.preventDefault();
      this.isFullScreen =  remote.getCurrentWindow().isFullScreen()
      console.log("resize", this.isFullScreen)
    })
  }

  ngOnInit() {
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }

}
