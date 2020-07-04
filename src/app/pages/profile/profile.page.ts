import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { User } from '../../interfaces/user.interface';
import { ipcRenderer } from 'electron';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
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
  
  constructor( 
    private configService:ConfigService,
    public dialog: MatDialog, 
    private _snackBar: MatSnackBar, 
    private router: Router
  ) {
    this.sistema = this.configService.getData("sistema")    
  }
  
  ngOnInit(){
    Auth.currentUserInfo().then(user => {
      this.user = user.attributes
    }).catch(err => console.error(err));
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