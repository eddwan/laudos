import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Sistema } from '../models/config';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class LaudosRemoteService {
  sistema:Sistema
  HTTPHeaders = {'Accept': 'application/json' }
  
  constructor(
    private http: HttpClient, 
    private configService:ConfigService
    ) { 
      this.sistema = this.configService.getData("sistema")
      
    }
    
    public getDataTable = async (route: string) => { 
      return this.http.get(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), await this.generateHeaders()).pipe(
        map( res => JSON.parse(JSON.stringify(res)))
        );
        // return this.generateHeaders().then( headers =>{
        //   return this.http.get(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), headers).pipe(
        //     map( res => JSON.parse(JSON.stringify(res)))
        //     );
        // })      
      }
      
      public read = async (route: string) => {
        return this.http.get<any>(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), await this.generateHeaders());
      }
      
      public create = async (route: string, body) => {
        return this.http.post(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, await this.generateHeaders());
      }
      
      public update = async (route: string, body) => {
        return this.http.put(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, await this.generateHeaders());
      }
      
      public delete = async (route: string) => {
        return this.http.delete<any>(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), await this.generateHeaders());
      }
      
      private createCompleteRoute = (route: string, envAddress: string) => {
        return `${envAddress}/${route}`;
      }
      
      private generateHeaders = () => {
        return new Promise( ( resolve, reject ) =>{
          Auth.currentSession().then(user => {
            this.HTTPHeaders["Authorization"] = user.getIdToken().getJwtToken()
            resolve({
              headers: new HttpHeaders(this.HTTPHeaders)
            })
          })
          
        })
      }
    }
    