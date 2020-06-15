import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { User } from '../../interfaces/user.interface';
import { ipcRenderer } from 'electron';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit{
    @Output()
    public pictureTaken = new EventEmitter<WebcamImage>();
  
    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
      // width: {ideal: 1024},
      // height: {ideal: 576}
    };
    public webcamImage: WebcamImage = null;
    public errors: WebcamInitError[] = [];
  
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  
    user=<User>{}

    constructor( public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router) {
        
    }

    ngOnInit(){
        Auth.currentUserInfo().then(user => {
            console.log(user)
            this.user = user.attributes
        }).catch(err => console.error(err));

        WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
            console.log(mediaDevices)
          this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        });
    }

    removePicture(){
        this.user.picture = "";
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

    public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
      }
    
      public showNextWebcam(directionOrDeviceId: boolean|string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        this.pictureTaken.emit(webcamImage);
      }
    
      public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
      }
    
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }
}