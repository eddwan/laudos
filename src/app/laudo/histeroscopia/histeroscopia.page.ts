import { Component, OnInit, Inject } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudosLocalService } from '../../services/laudos-local.service';
import * as uuid from 'uuid';
import { LaudoHisteroscopia } from '../../models/laudo'
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ImprimirService } from '../../services/imprimir.service';
import * as moment from 'moment'
import { ConfigService } from '../../services/config.service';
import { Sistema } from '../../models/config';
import * as isUUID from 'is-uuid';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

export interface DescricaoImagemDialogData {
  descricao: string;
}

export interface ReadFileImproved extends ReadFile{
  descricao: string
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
  public files: Array<ReadFileImproved> = [];
  public laudo:LaudoHisteroscopia;
  events: string[] = [];
  toggleMenopausaAmenorreia:[string];
    
  constructor(
    private laudosLocalService: LaudosLocalService, 
    private route: ActivatedRoute, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public imprimirService:ImprimirService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ){ 
      this.matIconRegistry.addSvgIcon(
        "txt-and-img",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/txt-and-img.svg")
      );

      this.matIconRegistry.addSvgIcon(
        "img-only",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img-only.svg")
      );
    }

    print(type:string = "singlePage"){
      this.imprimirService.gerarLaudoHisteroscopia(this.laudo, type)
      // let status = this.laudo.status.split("-")[0]
      // this.laudosLocalService.saveData(this.filename, this.laudo, status+'-printed')
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
          if(this.laudo.paciente.menopausa){
            this.toggleMenopausaAmenorreia = ["Menopausa"]
          }
          if(this.laudo.paciente.amenorreia){
            this.toggleMenopausaAmenorreia = ["Amenorréia"]
          }
          // console.log(this.laudo)
          
        }else{
          this.filename = uuid.v4()+".json"
          this.laudo = this.laudosLocalService.getModelo("Histeroscopia");
          this.laudo.paciente.data_exame = new Date().toJSON()
        }
      });
    }
    
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      // this.events.push(`${type}: ${event.value}`);
      switch(type){
        case "data_exame":
          this.laudo.paciente.data_exame = event.value.toJSON();
          if(this.laudo.paciente.data_ultima_menstruacao){
            this.laudo.paciente.dia_do_ciclo = moment(event.value).diff(moment(this.laudo.paciente.data_ultima_menstruacao), 'days')
          }else{
            this.laudo.paciente.dia_do_ciclo = moment(moment.now()).diff(event.value, 'days')
          }
          break;
        case "data_ultima_menstruacao":
          this.laudo.paciente.data_ultima_menstruacao = event.value.toJSON();
          if(this.laudo.paciente.data_exame){
            this.laudo.paciente.dia_do_ciclo = moment(this.laudo.paciente.data_exame).diff(event.value, 'days')
          }else{
            this.laudo.paciente.dia_do_ciclo = moment(moment.now()).diff(event.value, 'days')
          }
          break;
      }
    }
    
    onSubmit(){
      delete this.laudo.attachments
      this.laudo['attachments'] = {}
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