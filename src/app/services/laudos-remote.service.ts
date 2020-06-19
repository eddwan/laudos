import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Sistema } from '../models/config';
import { Auth } from 'aws-amplify';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LaudosRemoteService {
  sistema:Sistema
  idToken = "";
  
  constructor(
    private http: HttpClient, 
    private configService:ConfigService,
    private authService:AuthService
    ) { 
      this.sistema = this.configService.getData("sistema")
      this.authService.isLoggedIn$.subscribe(
        isLoggedIn => {
          if(isLoggedIn){
            Auth.currentSession().then(user => {
              this.idToken = user.getIdToken().getJwtToken()
            })
          }else{
            this.idToken = ""
          }
        }
        );
      }
      
      public getDataTable = (route: string) => {
        return this.http.get(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), this.generateHeaders()).pipe(
          map( res => JSON.parse(JSON.stringify(res)))
          );
        }
        
        public read = (route: string, params: any) => {
          return this.http.get<any>(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), {headers: this.generateHeaders().headers, params: params});
        }
        
        public create = (route: string, body) => {
          return this.http.post(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, this.generateHeaders());
        }
        
        public update = (route: string, body) => {
          return this.http.put(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, this.generateHeaders());
        }
        
        public delete = (route: string, params: any) => {
          return this.http.delete<any>(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), {headers: this.generateHeaders().headers, params: params});
        }
        
        private createCompleteRoute = (route: string, envAddress: string) => {
          return `${envAddress}/${route}`;
        }
        
        private generateHeaders = () => {
          
          return {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.idToken})
          }
        }
      }
      