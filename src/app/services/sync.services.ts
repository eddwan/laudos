import { Injectable } from '@angular/core';
import { LaudosLocalService } from './laudos-local.service';
import { LaudosRemoteService } from './laudos-remote.service';
import { LaudoDataTableItem } from '../models/laudo';
import { LaudoRemote } from '../models/laudo-remote';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class SyncServices {
    laudosLocais: LaudoDataTableItem[]
    laudosRemotos: LaudoRemote[]
    
    constructor( 
        private laudosLocalService:LaudosLocalService, 
        private laudosRemoteService:LaudosRemoteService){
            
            this.laudosLocais = this.getLaudosLocais();
            this.laudosRemotos = this.getLaudosRemotos();
            
        }
        
        private getLaudosLocais(): LaudoDataTableItem[]{
            let response: LaudoDataTableItem[] = []
            
            this.laudosLocalService.getDataTable().subscribe(res => {
                res.forEach( item => {
                    response.push(<LaudoDataTableItem>{
                        _id: item._id,
                        version: item.version,
                        created_at: item.created_at,
                        created_by: item.created_by,
                        updated_at: item.updated_at,
                        updated_by: item.updated_by
                    })
                })
            })
            return response as LaudoDataTableItem[];
        }
        
        private getLaudosRemotos(): LaudoRemote[]{
            let response:LaudoRemote[] = []
            this.laudosRemoteService.getDataTable("laudos/table").subscribe( res =>{
                res.forEach(item =>{
                    response.push(<LaudoRemote>{
                        _id: item._id,
                        version: item.version,
                        created_at: item.created_at,
                        created_by: item.created_by,
                        updated_at: item.updated_at,
                        updated_by: item.updated_by
                    })
                })
            })
            
            return response as LaudoRemote[]
        }

        public synchronize(){
            console.log("Checking remote for newer versions")
            this.laudosRemotos.forEach( (remote)=>{
                this.laudosLocais.forEach( local => {
                    // if remote.updated_at is newer than local.updated_ad
                    // post local to /laudo/version
                    // get /laudo/?_id=remote._id
                    if( remote._id == local._id){
                        if( moment(remote.updated_at).diff(local.updated_at, 'seconds', true) > 0){
                            console.log(remote.version)
                        }
                    }
                })
            });
            console.log("Updating local")
            this.laudosLocais = this.getLaudosLocais();
            console.log("Checking local for newer versions")
            this.laudosLocais.forEach( local => {
                this.laudosRemotos.forEach( remote => {
                    // if local.updated_ad is newer than remote.updated_at
                    // copy remote to /laudo/version
                    // put local to /laudo
                })
            })
            console.log("Updaing remote and local")
            this.laudosRemotos = this.getLaudosRemotos()
            this.laudosLocais = this.getLaudosLocais()
        }
    }