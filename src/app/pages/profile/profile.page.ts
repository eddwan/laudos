import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { User } from '../../interfaces/user.interface';
import { ipcRenderer } from 'electron';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WebcamImage} from 'ngx-webcam';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { Sistema } from '../../models/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit{
  sistema:Sistema
  user=<User>{}
  public webcamImage: WebcamImage = null;
  
  constructor( 
    private http: HttpClient, 
    private configService:ConfigService,
    public dialog: MatDialog, 
    private _snackBar: MatSnackBar, 
    private router: Router
  ) {
    this.sistema = this.configService.getData("sistema")    
  }
  
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  private generateHeaders = (idToken="") => {
          
    return {
      headers: new HttpHeaders({'Content-Type': 'image/jpeg', 'Authorization': idToken})
    }
  }
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  ngOnInit(){
    Auth.currentUserInfo().then(user => {
      // console.log(user)
      this.user = user.attributes
      // Auth.currentSession().then(user =>{
      //   this.http.get(this.createCompleteRoute("/user/profile/picture", this.sistema.cloud.apiUrl), this.generateHeaders(user.getIdToken().getJwtToken().toString())).subscribe( res => { 
      //     console.log(res)
      //   })
      // })
    }).catch(err => console.error(err));
  }
  
  removePicture(){
    this.user.picture = "";
    this.webcamImage = null;
  }
  
  saveProfile(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: "Tem certeza que deseja salvar as alterações? O sistema será reiniciado.",
        title: "Salvar alterações do perfil",
        btnYes: "Sim",
        colorYes: "primary"
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        Auth.currentAuthenticatedUser().then(user => {
          Auth.updateUserAttributes(user, this.user).then(data => {
            if(data == "SUCCESS"){
              Auth.currentSession().then(user =>{
                let buff = new Buffer(this.webcamImage.imageAsBase64, 'base64')
                let binary_string = window.atob(this.webcamImage.imageAsBase64);
                this.http.put(this.createCompleteRoute("user/profile/picture", this.sistema.cloud.apiUrl), this.webcamImage.imageAsBase64, this.generateHeaders(user.getIdToken().getJwtToken().toString())).subscribe( res => {
                  console.log(res);
                })
                
              })
              

              // this.router.navigate(["/"]).then(data => {
              //   ipcRenderer.send('reloadApp')
              // })
            }else{
              this._snackBar.open("Ocorreu um erro desconhecido!", "Fechar", {duration: 3000});
            }
            
          }).catch(err => {
            console.error(err)
            this._snackBar.open(err.message, "Fechar", {duration: 3000});
          })
        }).catch(err => console.error(err))
      }
    });
    
    
  }
  
}