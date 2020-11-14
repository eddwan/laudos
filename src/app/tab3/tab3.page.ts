import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Sistema, Empresa } from '../models/config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface AutocompletarDialogData {
  descricao: string;
  titulo: string;
  placeholder: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  config
  autocompletar = []
  telefones = []
  
  estados = [
    {sigla: 'AC', nome: 'Acre'},
    {sigla: 'AL', nome: 'Alagoas'},
    {sigla: 'AP', nome: 'Amapá'},
    {sigla: 'AM', nome: 'Amazonas'},
    {sigla: 'BA', nome: 'Bahia'},
    {sigla: 'CE', nome: 'Ceará'},
    {sigla: 'DF', nome: 'Distrito Federal'},
    {sigla: 'ES', nome: 'Espírito Santo'},
    {sigla: 'GO', nome: 'Goiás'},
    {sigla: 'MA', nome: 'Maranhão'},
    {sigla: 'MT', nome: 'Mato Grosso'},
    {sigla: 'MS', nome: 'Mato Grosso do Sul'},
    {sigla: 'MG', nome: 'Minas Gerais'},
    {sigla: 'PA', nome: 'Pará'},
    {sigla: 'PB', nome: 'Paraíba'},
    {sigla: 'PR', nome: 'Paraná'},
    {sigla: 'PE', nome: 'Pernambuco'},
    {sigla: 'PI', nome: 'Piauí'},
    {sigla: 'RJ', nome: 'Rio de Janeiro'},
    {sigla: 'RN', nome: 'Rio Grande do Norte'},
    {sigla: 'RS', nome: 'Rio Grande do Sul'},
    {sigla: 'RO', nome: 'Rondônia'},
    {sigla: 'RR', nome: 'Roraima'},
    {sigla: 'SC', nome: 'Santa Catarina'},
    {sigla: 'SP', nome: 'São Paulo'},
    {sigla: 'SE', nome: 'Sergipe'},
    {sigla: 'TO', nome: 'Tocantins'}
  ];
  
  constructor(private configService:ConfigService, private _snackBar: MatSnackBar, public dialog: MatDialog){
  }
  
  ngOnInit(){
    this.config = this.configService.getAll() || {}
    this.autocompletar = this.config.sistema.autocompletar.descricaoImagens || []
    this.telefones = this.config.empresa.telefones || []
  }
  
  saveConfig(){
    this.config.sistema.autocompletar.descricaoImagens = this.autocompletar;
    this.config.empresa.telefones = this.telefones;

    this.configService.saveObject(this.config)
    this._snackBar.open("Configurações salvas com sucesso!", "Fechar", {
      duration: 3000,
    });
  }

  adicionarTelefone(): void {
    const dialogRef = this.dialog.open(DialogEditarAutocompletar, {
      width: '600px',
      data: {descricao: "",titulo: "Adicionar Telefone", placeholder:"Digite o número de telefone. Ex: (24) 3323-0645"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if(result || result == "") this.telefones.push(result)
    });
  }

  editarTelefone(id:number): void {
    const dialogRef = this.dialog.open(DialogEditarAutocompletar, {
      width: '600px',
      data: {descricao: this.telefones[id],titulo: "Editar Telefone", placeholder:"Digite o número de telefone. Ex: (24) 3323-0645"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result || result == "") { this.telefones[id] = result } 
    });
  }

  excluirTelefone(id:number): void {
    this.telefones.splice(id, 1);
  }
  
  adicionarAutocompletar(): void {
    const dialogRef = this.dialog.open(DialogEditarAutocompletar, {
      width: '600px',
      data: {descricao: "",titulo: "Adicionar Autocompletar: Descrição da Imagem", placeholder:"Digite a descriçao"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if(result || result == "") this.autocompletar.push(result)
    });
  }
  
  editarAutocompletar(id:number): void {
    const dialogRef = this.dialog.open(DialogEditarAutocompletar, {
      width: '600px',
      data: {descricao: this.autocompletar[id],titulo: "Editar Autocompletar: Descrição da Imagem", placeholder:"Digite a descriçao"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result || result == "") { this.autocompletar[id] = result } 
    });
  }
  
  excluirAutocompletar(id:number): void {
    this.autocompletar.splice(id, 1);
  }
  
  
}

/// DIALOG COMPONENT

@Component({
  selector: 'dialog-editar-autocompletar',
  templateUrl: './dialog-autocompletar.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class DialogEditarAutocompletar {
  constructor(
    public dialogRef: MatDialogRef<DialogEditarAutocompletar>,
    @Inject(MAT_DIALOG_DATA) public data: AutocompletarDialogData) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
  }
  