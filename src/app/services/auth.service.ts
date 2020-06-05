import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService, authStorageService } from './config.service';
import { Sistema } from '../models/config';
import { AmplifyService }  from 'aws-amplify-angular';
import { Auth, Hub } from 'aws-amplify';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    sistema:Sistema
    storedUser:any;
    
    constructor(
        private amplify:AmplifyService,
        private http: HttpClient, 
        private authStorage: authStorageService,
        private configService:ConfigService
        ) { 
            this.sistema = this.configService.getData("sistema")
            // obtem os dados da sessão armazenados em disco
            this.storedUser = this.authStorage.getAll() 
        }
        
        public validarToken(idToken:string){
            return this.http.post('https://ijvw7834z1.execute-api.us-east-1.amazonaws.com/prod/validatoken', {}, {headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': idToken})})
            
        }
        
        
        private createCompleteRoute = (route: string, envAddress: string) => {
            return `${envAddress}/${route}`;
        }
        
        private generateHeaders = () => {
            return {
                headers: new HttpHeaders({'Content-Type': 'application/json', 'x-api-key': this.sistema.cloud.apiKey})
            }
        }
    }
    