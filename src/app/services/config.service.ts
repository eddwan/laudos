import { remote } from 'electron';
const Store = remote.require('electron-store');

export class ConfigService{
    store = new Store();

    constructor(){  }

    saveData(key, value){
        this.store.set(key, value)
    }

    saveObject(obj){
        this.store.set(obj)
    }

    getData(key){
        return this.store.get(key) || {}
    }

    getAll(){
        return this.store.store || {};
    }

}

export class ModelosService{
    store

    constructor(){ }

    getModelo(modelo:string){
        this.store = new Store({ name: "modelo"+modelo});
        return this.store.get("modelo")
    }

    getAll(modelo:string){
        this.store = new Store({ name: "modelo"+modelo});
        return this.store.store
    }

    saveModelo(modelo:string, data){
        this.store = new Store({ name: "modelo"+modelo});
        this.store.set("modelo", data);
    }
}