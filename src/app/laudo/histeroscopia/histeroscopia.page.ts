import { Component, OnInit, Inject } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoHisteroscopia } from '../../models/laudo'
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

export interface DescricaoImagemDialogData {
  descricao: string;
}

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
  toggleMenopausaAmenorreia:[string];
  
  addFile(file: ReadFile) {
    this.files.push(file);
    if(!this.laudo.descricaoImagens[file.name]){
      this.laudo.descricaoImagens[file.name] = { descricao: ""}
    }
  }
  
  constructor(
    private laudosLocalService: LaudosLocalService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ){ }
    
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
        console.log('The dialog was closed', result);
        if(result || result == "") this.laudo.descricaoImagens[filename].descricao = result
      });
    }
    
    ngOnInit() {
      
      this.route.paramMap.subscribe( params => {
        console.log(params["params"])
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
          if(this.laudo.paciente.menopausa){
            this.toggleMenopausaAmenorreia = ["Menopausa"]
          }
          if(this.laudo.paciente.amenorreia){
            this.toggleMenopausaAmenorreia = ["Amenorréia"]
          }
          console.log(this.laudo)
          
        }else{
          this.filename = uuid.v4()+".json"
          this.laudo = this.laudosLocalService.getModelo("modeloHisteroscopia.json");
        }
      });
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
      console.log(this.laudo)
      this.laudosLocalService.saveData(this.filename, this.laudo);
      this._snackBar.open("Laudo salvo com sucesso!", "Fechar", {
        duration: 2000,
      });
    }
    
    toggleChange(event) {
      let toggle = event.source;
      if (toggle) {
        let group = toggle.buttonToggleGroup;
        if (event.value.some(item => item == toggle.value)) {
          group.value = [toggle.value];
          switch(group.value[0]){
            case "Amenorréia":
            this.laudo.paciente.menopausa = false;
            this.laudo.paciente.amenorreia = true;
            break;
            case "Menopausa":
            this.laudo.paciente.menopausa = true;
            this.laudo.paciente.amenorreia = false;
            break;
          }
        }
      }else{
        this.laudo.paciente.menopausa = false;
        this.laudo.paciente.amenorreia = false;
      }
    }
  }
  


  /// DIALOG COMPONENT
  
  @Component({
    selector: 'dialog-editar-descricao',
    templateUrl: './dialog-editar-descricao.page.html',
    styleUrls: ['./histeroscopia.page.scss'],
  })
  export class DialogEditarDescricaoImagem {
    options: string[] = ['One', 'Two', 'Three'];

    constructor(
      public dialogRef: MatDialogRef<DialogEditarDescricaoImagem>,
      @Inject(MAT_DIALOG_DATA) public data: DescricaoImagemDialogData) {}
      
      onNoClick(): void {
        this.dialogRef.close();
      }
      
    }