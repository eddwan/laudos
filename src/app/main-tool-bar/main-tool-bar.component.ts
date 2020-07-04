import { Component, OnInit, SkipSelf } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema, Empresa } from '../models/config';
import { AuthService } from '../services/auth.service';
import { Auth } from 'aws-amplify';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss']
})
export class MainToolBarComponent implements OnInit {
  online: boolean = false;
  sistema: Sistema;
  empresa: Empresa; 
  user:User;

  customStyle = {
    border: "3px solid white",
    width: "50px",
    height: "50px",
    verticalAlign: 'middle',
    textAlign: 'center',
    borderRadius: "50%"
  };
  
  constructor(
    private config:ConfigService,
    public dialog: MatDialog,
    private authService:AuthService
    ){
      this.sistema = this.config.getData("sistema")
      this.empresa = this.config.getData("empresa")
    }
    
    ngOnInit() {
      this.authService.auth$.subscribe((user) => {
        console.log(user)
        this.user = user;
      });
      
      this.online = remote.getGlobal("isOnline")
      ipcRenderer.on('online-status', (event,arg)=>{
        this.online = <boolean>arg
        if(<boolean>arg){
          this.customStyle = {
            border: "3px solid greenYellow",
            width: "50px",
            height: "50px",
            verticalAlign: 'middle',
            textAlign: 'center',
            borderRadius: "50%"
          }
        }else{
          this.customStyle = {
            border: "3px solid red",
            width: "50px",
            height: "50px",
            verticalAlign: 'middle',
            textAlign: 'center',
            borderRadius: "50%"
          }
        }
        
      })

    }
    
    btnExit(){
      remote.app.quit();
    }
    
    mnuDesconectar(){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          message: "Tem certeza que deseja desconectar da sua conta na núvem?",
          title: "Já está de saída?",
          btnYes: "Sim",
          colorYes: "primary"
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          Auth.signOut()
        }
      });
      
    }
    
  }
  