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
        console.log(JSON.parse(rawData))
        return JSON.parse(rawData);
    }

    public getModelo(modelo: string) {
        // let rawData = fs.readFileSync('./'+filename, "utf8");
        // return JSON.parse(rawData);
        return this.modelosService.getModelo(modelo)
    }

    public saveData( filename: string, laudo: any, status: string = "local-saved"){
        this.sistema = this.configService.getData("sistema") || {}
        laudo.status = status;
        let currentVersion = laudo.version || ""
        delete laudo["version"]
        delete laudo["updated_at"]
        delete laudo["updated_by"]
        let newVersion = crypto.createHash('md5').update(JSON.stringify(laudo)).digest("hex");
        if ( newVersion != currentVersion){
            console.log("new", newVersion, "current", currentVersion)
            laudo["version"] = newVersion
            laudo["created_at"] = laudo.created_at ? laudo.created_at : new Date().toJSON()
            laudo["created_by"] = laudo.created_by ? laudo.created_by : this.sistema.user.email
            laudo["updated_at"] = new Date().toJSON()
            laudo["updated_by"] = this.sistema.user.email
            fs.writeFile(this.sistema.datastore.path+filename, JSON.stringify(laudo), "utf8", (err) => {
                if(err) console.error(err)
            })
            return "Laudo salvo com sucesso!"
        }else{
            console.log("new", newVersion, "current", currentVersion)
            console.log("nothing changed!")
            return "Não há alterações a serem salvas."
        }

    }

    public deleteFile(filename: string){
        try{
            fs.unlinkSync(this.sistema.datastore.path+filename);
        } catch (err){
            console.log(err)
        }
    }
}
