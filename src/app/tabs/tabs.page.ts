import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  online: boolean = true;

  constructor(){
    ipcRenderer.on('online-status-changed', (event, arg) => {
      
      this.online = arg;
      console.log(arg)
    })
  }
}
