import { Component, OnInit } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoHisteroscopia } from '../../models/laudo'

@Component({
  selector: 'app-histeroscopia',
  templateUrl: './histeroscopia.page.html',
  styleUrls: ['./histeroscopia.page.scss'],
  providers: [ LaudosLocalService]
})
export class HisteroscopiaPage implements OnInit {
  public filename: string = uuid.v4()
  public readMode = ReadMode.dataURL;
  public isHover: boolean;
  public files: Array<ReadFile> = [];
  
  addFile(file: ReadFile) {
    this.files.push(file);
  }
  
  constructor(private laudosLocalService: LaudosLocalService) { }
  
  ngOnInit() {
  }

  save(){
    let teste: LaudoHisteroscopia
    this.laudosLocalService.saveData(this.filename, teste)
  }
  
  toggleChange(event) {
    let toggle = event.source;
    if (toggle) {
      let group = toggle.buttonToggleGroup;
      if (event.value.some(item => item == toggle.value)) {
        group.value = [toggle.value];
      }
    }
  }
}
