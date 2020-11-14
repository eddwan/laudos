import { Component, OnInit } from '@angular/core';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { LaudoLaparoscopia } from '../../models/laudo'
import {MatSnackBar} from '@angular/material/snack-bar';
import { ModelosService } from '../../services/config.service';

@Component({
  selector: 'app-laparoscopia',
  templateUrl: './laparoscopia.page.html',
  styleUrls: ['./laparoscopia.page.scss']
})
export class LaparoscopiaPage implements OnInit {
  public laudo:LaudoLaparoscopia;
  
  constructor(
    private _snackBar: MatSnackBar,
    private modeloService:ModelosService
    ){ }
    
    ngOnInit() {
      this.laudo = this.modeloService.getModelo("Laparoscopia");
    }
    
    onSubmit(){
      this.modeloService.saveModelo("Laparoscopia", this.laudo);
      this._snackBar.open("Laudo salvo com sucesso!", "Fechar", {
        duration: 3000,
      });
    }
  }
