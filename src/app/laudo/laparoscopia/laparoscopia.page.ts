import { Component, OnInit, Inject } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoLaparoscopia } from '../../models/laudo'
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ImprimirService } from '../../services/imprimir.service';
import { ConfigService } from '../../services/config.service';
import { Sistema } from '../../models/config';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import * as isUUID from 'is-uuid';
import { ipcRenderer } from 'electron';

export interface DescricaoImagemDialogData {
  descricao: string;
}

export interface ReadFileImproved extends ReadFile{
  descricao: string
}

@Component({
  selector: 'app-laparoscopia',
  templateUrl: './laparoscopia.page.html',
  styleUrls: ['./laparoscopia.page.scss'],
  providers: [ LaudosLocalService]
})
export class LaparoscopiaPage implements OnInit {
  public filename: string
  public readMode = ReadMode.dataURL;
  public isHover: boolean;
  public files: Array<ReadFileImproved> = [];
  public laudo:LaudoLaparoscopia;
  private imprimindo:boolean = false;
  events: string[] = [];

  constructor(
    private laudosLocalService: LaudosLocalService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public imprimirService:ImprimirService
  ) { }

  print(){
    this.imprimindo = true;
    this.imprimirService.gerarLaudoLaparoscopia(this.laudo)
    ipcRenderer.on('finishPreview', (event, arg) => {
      this.imprimindo = false
      console.log(arg) // prints "pong"
    })
  }
  
  addFile(file: ReadFileImproved) {
    let tmpFile =  {
      content: file.content,
      size: file.size,
      name: isUUID.v4(file.name) ? file.name : uuid.v4(),
      type: file.type,
      readMode: file.readMode,
      descricao: file.descricao || '',
      underlyingFile: file.underlyingFile
    }
    this.files.push(tmpFile);
  }

  apagarImagem(filename: string) {
    this.files.forEach( file => {
      if(file.name == filename){
        this.files.splice(this.files.indexOf(file), 1);
      }
    })
  }
  
  editarDescricao(filename:string): void {
    let index = this.files.findIndex( (obj) => {
      return obj.name === filename
    })

    const dialogRef = this.dialog.open(DialogEditarDescricaoImagem, {
      width: '450px',
      data: {descricao: this.files[index].descricao}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if(result || result == "") this.files[index].descricao = result
    });
  }
  
  ngOnInit() {
    
    this.route.paramMap.subscribe( params => {
      // console.log(params["params"])
      if(params["params"]["filename"]){
        this.filename = params["params"]["filename"]
        this.laudo = this.laudosLocalService.getData(this.filename);
        // Reads the images from json object 
        let keys = Object.keys(this.laudo.attachments)
        if(keys.length){
          keys.forEach( key => {
            // add each image file to the files object
            this.addFile(this.laudo.attachments[key])
          })
        }
        // console.log(this.laudo)
        
      }else{
        this.filename = uuid.v4()+".json"
        this.laudo = this.laudosLocalService.getModelo("Laparoscopia");
        this.laudo.paciente.data_exame = new Date().toJSON()
      }
    });
  }
  
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    switch(type){
      case "data_exame":
        this.laudo.paciente.data_exame = event.value.toJSON();
        break;
    }
  }
  
  onSubmit(){
    delete this.laudo.attachments;
    this.laudo['attachments'] ={}
    this.files.forEach( file => {
      // Store the image content to the laudo object
      this.laudo.attachments[file.name] = {
        content: file.content,
        size: file.size,
        name: file.name,
        type: file.type,
        readMode: file.readMode,
        descricao: file.descricao
      }
    })
    // console.log(this.laudo)
    let result = this.laudosLocalService.saveData(this.filename, this.laudo);
    this._snackBar.open(result, "Fechar", {
      duration: 3000,
    });
  }
}

/// DIALOG COMPONENT

@Component({
  selector: 'dialog-editar-descricao',
  templateUrl: './dialog-editar-descricao.page.html',
  styleUrls: ['./laparoscopia.page.scss'],
})
export class DialogEditarDescricaoImagem implements OnInit{
  options;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<DialogEditarDescricaoImagem>,
    @Inject(MAT_DIALOG_DATA) public data: DescricaoImagemDialogData) {
      let sistema: Sistema = this.configService.getData("sistema");
      this.options = sistema.autocompletar.descricaoImagens;
    }

    ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
  }