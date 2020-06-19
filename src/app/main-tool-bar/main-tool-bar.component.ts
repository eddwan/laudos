import { Component, OnInit, SkipSelf } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { ConfigService } from '../services/config.service';
import { Sistema, Empresa } from '../models/config';
import { AuthService } from '../services/auth.service';
import { Auth } from 'aws-amplify';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { User } from '../interfaces/user.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  picture:string = null;

  customStyle = {
    border: "3px solid white",
    width: "50px",
    height: "50px",
    verticalAlign: 'middle',
    textAlign: 'center',
    borderRadius: "50%"
  };
  
  constructor(
    private http: HttpClient, 
    private config:ConfigService,
    public dialog: MatDialog,
    private authService:AuthService
    ){
      this.sistema = this.config.getData("sistema")
      this.empresa = this.config.getData("empresa")
      if(localStorage.getItem('picture')){
        this.picture = localStorage.getItem('picture')
      }
    }
    
    ngOnInit() {
      this.authService.auth$.subscribe((user) => {
        this.user = user;

        Auth.currentSession().then(user=>{
          console.log('starting img')
          this.http.get(this.createCompleteRoute("/user/profile/picture", this.sistema.cloud.apiUrl), this.generateHeaders(user.getIdToken().getJwtToken().toString())).subscribe( res => { 
            localStorage.setItem('picture', res['data'])
          })
          
        })
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
          // Auth.currentAuthenticatedUser().then( user => {
          //   Auth.updateUserAttributes(user, {'picture':'https://instituto-dev.s3.amazonaws.com/2f2101c6-edef-40be-8a0e-90f65a612591'})
          // })
          localStorage.removeItem('picture')
        }
      });
      
    }

    private generateHeaders = (idToken="") => {
          
      return {
        headers: new HttpHeaders({'Accept': 'image/jpg', 'Authorization': idToken})
      }
    }
    private createCompleteRoute = (route: string, envAddress: string) => {
      return `${envAddress}/${route}`;
    }
  
    
  }
  