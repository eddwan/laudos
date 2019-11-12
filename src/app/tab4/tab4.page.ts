import { Component, OnInit } from '@angular/core';
import { ImprimirService } from '../services/imprimir.service';
import { ModelosService } from '../services/config.service';
import { Pedido } from '../models/config';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page implements OnInit {
  public pedido:Pedido;
  objectKeys = Object.keys;
  public editForm: boolean = false;
  public model = JSON.parse(JSON.stringify(this.modelosService.getModelo("Pedidos")))
  
  constructor(public imprimirService:ImprimirService, private modelosService:ModelosService){}
  
  editPedidosForm(){
    this.editForm = true
  }

  savePedidosForm(){
    this.modelosService.saveModelo("Pedidos", this.model)
    this.editForm = false
  }

  cancelPedidosForm(){
    this.editForm = false
    this.model = JSON.parse(JSON.stringify(this.modelosService.getModelo("Pedidos")))
  }

  addNewItem(key:string){
    this.model[key]['items'].push({value: "", isSelected: false})
  }

  removeItem(key:string, value:string){
    let index = this.model[key].items.findIndex(elem => elem.value === value)
    this.model[key].items.splice(index,1)
  }

  checkUncheckAll(group:string) {
    for (var i = 0; i < this.model[group].items.length; i++) {
      this.model[group].items[i].isSelected = this.model[group].masterSelected;
    }
  }

  print(){
    this.pedido.pedidos = []
    for( let elem in this.model){
      if(!this.model[elem].notListed){
        this.model[elem].items.forEach( item => {
          if(item.isSelected){
            this.pedido.pedidos.push(item.value)
          }
        })
      }
    }
    this.pedido.medico = {
      nome: this.model.medico.nome,
      crm: this.model.medico.crm
    }
    if(this.pedido.pedidos.length > 0) this.imprimirService.gerarPedido(this.pedido);
  }
  
  toggleCheckBox(group:string){
    this.model[group].masterSelected = this.model[group].items.every(function(item:any) {
      return item.isSelected == true;
    })
  }
  
  ngOnInit(){
    this.pedido = {
      nome: "",
      indicacao: "",
      pedidos: [],
      medico: {}
    }
  }
}