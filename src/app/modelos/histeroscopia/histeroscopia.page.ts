import { Component, OnInit, Inject } from '@angular/core';
import { LaudosLocalService } from '../../services/laudos-local.service';
import { LaudoHisteroscopia } from '../../models/laudo'
import { MatSnackBar } from '@angular/material';
import { ModelosService } from '../../services/config.service';

@Component({
  selector: 'app-histeroscopia',
  templateUrl: './histeroscopia.page.html',
  styleUrls: ['./histeroscopia.page.scss']
})
export class HisteroscopiaPage implements OnInit {
  public laudo:LaudoHisteroscopia;
    
  constructor(
    private _snackBar: MatSnackBar,
    private modeloService:ModelosService
    ){ }

    
    ngOnInit() {
      this.laudo = this.modeloService.getModelo("Histeroscopia");
    }

    
    onSubmit(){
      this.modeloService.saveModelo("Histeroscopia", this.laudo);

      this._snackBar.open("Laudo salvo com sucesso!", "Fechar", {
        duration: 3000,
      });
    }
  }