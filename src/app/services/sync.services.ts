import { Injectable } from '@angular/core';
import { LaudosLocalService } from './laudos-local.service';
import { LaudosRemoteService } from './laudos-remote.service';
import { LaudoDataTableItem } from '../models/laudo';
import { LaudoRemote } from '../models/laudo-remote';
import * as moment from 'moment';
import * as uuid from 'uuid';

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
            filename: item.filename,
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
    
    public downloadLaudo(id:string, forceSave:boolean=false){
      this.laudosRemoteService.read('laudo', {_id: id}).subscribe(
        res => {
          let isNew = true
          this.laudosLocalService.getDataTable().subscribe(laudos => {
            laudos.forEach( laudo => {
              if(laudo["_id"] = res["_id"]){
                isNew = false
                if(forceSave){
                  this.laudosLocalService.forceSaveData(laudo["filename"], res)
                }else{
                  this.laudosLocalService.saveData(laudo["filename"], res, 'remote-saved')
                }
              }
            });
          });
          if(isNew){
            if(forceSave){
              this.laudosLocalService.forceSaveData(uuid.v4()+".json", res)
            }else{
              this.laudosLocalService.saveData(uuid.v4()+".json", res, 'remote-saved')
            }
          }
          return "Laudo baixado com sucesso!"
        }
        )
      }
      
      public synchronize(){
        console.log("Checking remote for newer versions")
        this.laudosRemotos.forEach( (remote)=>{
          this.laudosLocais.forEach( local => {
            // if remote.updated_at is newer than local.updated_ad
            
            if( remote._id == local._id){
              console.log(moment(remote.updated_at).diff(local.updated_at, 'seconds', true))
              if( moment(remote.updated_at).diff(local.updated_at, 'seconds', true) > 0){
                console.log(remote.version, local.version)
                // TODO: post local to /laudo/version
                
                // creates a copy of the current laudo in the folder version with name pattern filename.version.json
                let laudoCopy = this.laudosLocalService.getData(local.filename)
                let result = this.laudosLocalService.saveVersion(local.filename, laudoCopy)
                // get /laudo/?_id=remote._id
                if(result) this.downloadLaudo(remote._id, true)
                
                
              }
            }
          })
        });
        console.log("Updating local")
        this.laudosLocais = this.getLaudosLocais();
        console.log("Checking local for newer versions")
        this.laudosLocais.forEach( local => {
          this.laudosRemotos.forEach( remote => {
            if( remote._id == local._id){
              console.log(moment(local.updated_at).diff(remote.updated_at, 'seconds', true))
              // if local.updated_ad is newer than remote.updated_at
              if( moment(local.updated_at).diff(remote.updated_at, 'seconds', true) > 0){
                let localFull = this.laudosLocalService.getData(local.filename)
                // put local to /laudo which handles the timestamp and versions differences
                this.laudosRemoteService.update("laudo", localFull).subscribe(res =>{
                  console.log(res)
                  this.laudosLocalService.setStatus(local.filename, this.translateLocalToRemoteStatus(localFull.status))
                })
              }
            }
          })
        })
        console.log("Updating remote and local")
        this.laudosRemotos = this.getLaudosRemotos()
        this.laudosLocais = this.getLaudosLocais()
      }
      
      public sendLaudo(filename:string){
        let laudo = this.laudosLocalService.getData(filename)
        if(laudo["_id"]==""){
          delete laudo["_id"]
          this.laudosRemoteService.create("laudo", JSON.stringify(laudo)).subscribe(res => {
            if(res){
              if(res["_id"]){
                laudo["_id"] = res["_id"];
                this.laudosLocalService.saveData(filename, laudo, this.translateLocalToRemoteStatus(laudo["status"]));
              }
            }else{
              console.error("Ocorreu um erro ao gravar o laudo", res)
            }
          });
        }else{
          console.log("Já existe um laudo remoto! Tentando atualizar dados.")
          laudo["_id"]=laudo["_id"]
          this.laudosRemoteService.update("laudo", JSON.stringify(laudo)).subscribe(res => {
            if(res){
              this.laudosLocalService.saveData(filename, laudo, this.translateLocalToRemoteStatus(laudo["status"]));
            }else{
              console.log("Não encontrado remoto");
              this.laudosLocalService.saveData(filename, laudo, "remote-error" );
            }
          })
        }            
      }
      
      private translateLocalToRemoteStatus(status:string){
        switch(status){
          case "local-saved":
          return "remote-saved"
          break;
          case "local-printed":
          return "remote-printed"
          break;
          default:
          return status;
          break;
        }
      }
    }