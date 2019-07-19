import { Component } from '@angular/core';
import * as fs from 'fs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  constructor(){
    
    fs.readdir('/Users/usuario/Desktop/laudos/laudos', (err, files) => {
      files.forEach(file => {
        console.log(file);
        fs.readFile('/Users/usuario/Desktop/laudos/laudos/'+file, "utf8",  (err, data)  => {
          if (err) throw err;
          const obj = JSON.parse(data);
          console.log(obj["nome"])
        });
      });
    });
    
  }
  
}
