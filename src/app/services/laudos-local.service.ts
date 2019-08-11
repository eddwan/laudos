import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { LaudoDataTableItem } from '../models/laudo';
import { of } from 'rxjs';
import { ConfigService, ModelosService } from './config.service';
import { Sistema } from '../models/config';
import * as crypto from 'crypto'

@Injectable({
    providedIn: 'root'
})
export class LaudosLocalService {
    laudosLocaisTable: LaudoDataTableItem[] = [];
    sistema: Sistema

    constructor(
        private configService: ConfigService, 
        private modelosService:ModelosService) { 
        this.sistema = this.configService.getData("sistema") || {}
    }
    
    public getDataTable(){
        this.sistema = this.configService.getData("sistema") || {}
        this.laudosLocaisTable = [];
        let files = fs.readdirSync(this.sistema.datastore.path);
        files.forEach(file => {
            if(path.extname(file) == ".json"){
                let rawData = fs.readFileSync(this.sistema.datastore.path+file, "utf8");
                let obj = JSON.parse(rawData);
                const laudo ={
                    "filename": file,
                    "_id": obj._id || "",
                    "nome": obj.paciente.nome,
                    "tipo": obj.laudo.tipo,
                    "data_exame": new Date(obj.paciente.data_exame).toLocaleDateString(),
                    "status": obj.status,
                    "version": obj.version || "",
                    "created_at": obj.created_at || "",
                    "created_by": obj.created_by || "",
                    "updated_at": obj.updated_at || "",
                    "updated_by": obj.updated_by || ""
                }
                this.laudosLocaisTable.push(laudo)
            }
        });
        return of(this.laudosLocaisTable);
    }
    
    public getData(filename: string) {
        this.sistema = this.configService.getData("sistema") || {}
        let rawData = fs.readFileSync(this.sistema.datastore.path+filename, "utf8");
        return JSON.parse(rawData);
    }

    public getModelo(modelo: string) {
        // let rawData = fs.readFileSync('./'+filename, "utf8");
        // return JSON.parse(rawData);
        return this.modelosService.getModelo(modelo)
    }

    public forceSaveData( filename: string, laudo: any){
        this.sistema = this.configService.getData("sistema") || {}
        fs.writeFile(this.sistema.datastore.path+filename, JSON.stringify(laudo), "utf8", (err) => {
            if(err) console.error(err)
        })
        return "Laudo salvo com sucesso!"
    }

    public setStatus( filename: string, status:string){
        this.sistema = this.configService.getData("sistema") || {}
        let laudo = this.getData(filename)
        laudo["status"] = status
        fs.writeFile(this.sistema.datastore.path+filename, JSON.stringify(laudo), "utf8", (err) => {
            if(err) console.error(err)
        })
        return "Laudo salvo com sucesso!"
    }

    public saveData( filename: string, laudo: any, status: string = "local-saved"){
        this.sistema = this.configService.getData("sistema") || {}
        let currentVersion = laudo.version || ""
        let currStatus = laudo["status"]
        delete laudo["status"]
        delete laudo["version"]
        delete laudo["updated_at"]
        delete laudo["updated_by"]
        laudo["created_at"] = laudo.created_at ? laudo.created_at : new Date().toJSON()
        laudo["created_by"] = laudo.created_by ? laudo.created_by : this.sistema.user.email
        let newVersion = crypto.createHash('md5').update(JSON.stringify(laudo)).digest("hex");
        if ( newVersion != currentVersion){
            // make a version copy of the current laudo.
            if(currStatus != "new")this.saveVersion(filename, this.getData(filename))
            
            // console.log("new", newVersion, "current", currentVersion)
            laudo.status = status;
            laudo["version"] = newVersion
            laudo["updated_at"] = new Date().toJSON()
            laudo["updated_by"] = this.sistema.user.email
            fs.writeFile(this.sistema.datastore.path+filename, JSON.stringify(laudo), "utf8", (err) => {
                if(err) console.error(err)
            })
            // this.configService.saveMetadata(filename.split(".json")[0], { status: { saved : true}})
            return "Laudo salvo com sucesso!"
        }else{
            // console.log("new", newVersion, "current", currentVersion)
            // console.log("nothing changed!")
            return "Não há alterações a serem salvas."
        }

    }

    public saveVersion( filename: string, laudo: any){
        this.sistema = this.configService.getData("sistema") || {}
        let versionsPath = this.sistema.datastore.path+"versions/";
        if(!fs.existsSync(versionsPath)){
            fs.mkdir(versionsPath, (err) =>{
                console.log(err)
                return false
            })
        }
        let backupFile = versionsPath+filename.split(".")[0]+"."+laudo.version+".json"

        fs.writeFile(backupFile, JSON.stringify(laudo), "utf8", (err) => {
                if(err){ 
                    console.error(err)
                    return false
                }
            })
            return "Laudo salvo com sucesso!"
    }

    public deleteFile(filename: string){
        try{
            fs.unlinkSync(this.sistema.datastore.path+filename);
        } catch (err){
            console.log(err)
        }
    }
}
