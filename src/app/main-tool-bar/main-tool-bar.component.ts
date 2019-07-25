import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit {
  online: boolean;
  constructor() { 

  }

  ngOnInit() {
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }

}
