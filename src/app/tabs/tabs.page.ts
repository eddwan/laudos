import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  online: boolean;

  constructor(){
  }

  ngOnInit(){
    ipcRenderer.on('online-status-changed', (event, arg) => {
      this.online = arg;
    })
  }
}
