import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { User } from '../../interfaces/user.interface';
import { ipcRenderer } from 'electron';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WebcamImage} from 'ngx-webcam';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit{
  // latest snapshot
  public webcamImage: WebcamImage = null;
  
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }
  user=<User>{}
  
  constructor( public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router) {
    
  }
  
  ngOnInit(){
    Auth.currentUserInfo().then(user => {
      console.log(user)
      this.user = user.attributes
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
              this.router.navigate(["/"]).then(data => {
                ipcRenderer.send('reloadApp')
              })
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