import { Component, OnInit, Inject } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoLaparoscopia } from '../../models/laudo'
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ImprimirService } from '../../services/imprimir.service';
import { ConfigService } from '../../services/config.service';
import { Sistema } from '../../models/config';

export interface DescricaoImagemDialogData {
  descricao: string;
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
  public files: Array<ReadFile> = [];
  public laudo:LaudoLaparoscopia;
  events: string[] = [];

  constructor(
    private laudosLocalService: LaudosLocalService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public imprimirService:ImprimirService
  ) { }

  print(){
    this.imprimirService.gerarLaudoLaparoscopia(this.laudo)
  }
  
  addFile(file: ReadFile) {
    this.files.push(file);
    if(!this.laudo.descricaoImagens[file.name]){
      this.laudo.descricaoImagens[file.name] = { descricao: ""}
    }
  }

  apagarImagem(filename: string) {
    this.files.forEach( file => {
      if(file.name == filename){
        this.files.splice(this.files.indexOf(file), 1);
        delete this.laudo.attachments[filename];
        delete this.laudo.descricaoImagens[filename];
      }
    })
  }
  
  editarDescricao(filename:string): void {
    const dialogRef = this.dialog.open(DialogEditarDescricaoImagem, {
      width: '450px',
      data: {descricao: this.laudo.descricaoImagens[filename].descricao}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if(result || result == "") this.laudo.descricaoImagens[filename].descricao = result
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
    this.files.forEach( file => {
      // Store the image content to the laudo object
      this.laudo.attachments[file.name] = {
        content: file.content,
        size: file.size,
        name: file.name,
        type: file.type,
        readMode: file.readMode
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
export class DialogEditarDescricaoImagem {
  options;

  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<DialogEditarDescricaoImagem>,
    @Inject(MAT_DIALOG_DATA) public data: DescricaoImagemDialogData) {
      let sistema: Sistema = this.configService.getData("sistema");
      this.options = sistema.autocompletar.descricaoImagens;
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
  }