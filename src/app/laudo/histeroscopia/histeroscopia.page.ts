import { Component, OnInit } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoHisteroscopia } from '../../models/laudo'
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-histeroscopia',
  templateUrl: './histeroscopia.page.html',
  styleUrls: ['./histeroscopia.page.scss'],
  providers: [ LaudosLocalService]
})
export class HisteroscopiaPage implements OnInit {
  public filename: string
  public readMode = ReadMode.dataURL;
  public isHover: boolean;
  public files: Array<ReadFile> = [];
  public laudo:LaudoHisteroscopia;
  events: string[] = [];

  addFile(file: ReadFile) {
    this.files.push(file);
  }
  
  constructor(private laudosLocalService: LaudosLocalService) { }
  
  ngOnInit() {
    this.filename = uuid.v4()
    // this.laudo = this.laudosLocalService.getData(this.filename);
    // if(!data){
    //   this.laudo = data;
    // }
    this.laudo = this.laudosLocalService.getData("teste.json");   
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    switch(type){
      case "data_exame":
        this.laudo.paciente.data_exame = event.value.toJSON();
        break;
      case "data_ultima_menstruacao":
          this.laudo.paciente.data_ultima_menstruacao = event.value.toJSON();
          break;
    }
  }

  onSubmit(){
    console.log(this.laudo)
    this.laudosLocalService.saveData("teste.json", this.laudo);
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
