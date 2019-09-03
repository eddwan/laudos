import { Component, OnInit } from '@angular/core';
import { ImprimirService } from '../services/imprimir.service';

export interface Pedido {
  nome: string,
  indicacao: string,
  pedidos: string[],
  medico: string,
  crm: string
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page implements OnInit {
  public pedido:Pedido;
  objectKeys = Object.keys;
  
  public model = {
    'Rotina Ginecológica' : {
      masterSelected: false,
      items: [
        {id: 1, value: 'Citologia Oncótica', isSelected: false},
        {id: 2, value: 'Ultrassonografia transvaginal', isSelected: false},
        {id: 3, value: 'Mamografia', isSelected: false},
        {id: 4, value: 'Ultrassonografia de mamas', isSelected: false},
        {id: 5, value: 'Ultrassonografia de abdome total', isSelected: false},
        {id: 6, value: 'EAS + urinocultura + antibiograma', isSelected: false},
        {id: 7, value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
        {id: 8, value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false},
        {id: 9, value: 'Marcadores tumorais: CA124, CEA, alfa feto proteína, beta hcg, CA 19.9', isSelected: false},
      ]
    },
    'Endometriose':{
      masterSelected: false,
      items: [
        {id: 1, value: 'Ressonância de pelve com preparo', isSelected: false},
        {id: 2, value: 'Retossigmóideoscopia', isSelected: false},
        {id: 3, value: 'Ultrassom de rins e vais urinárias', isSelected: false},
        {id: 4, value: 'CA125', isSelected: false},
        {id: 5, value: 'Histeroscopia com biópsia sob sedação', isSelected: false},
        {id: 6, value: 'EAS + urinocultura + antibiograma', isSelected: false},
        {id: 7, value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
        {id: 8, value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false}
      ]
    },
    'Infertilidade':{
      masterSelected: false,
      items: [
        {id: 1, value: 'Histeroscopia', isSelected: false},
        {id: 2, value: 'Histerossalpingografia', isSelected: false},
        {id: 3, value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
        {id: 4, value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false},
        {id: 5, value: 'Sorologias: anti-hiv, vdrl, anti-hcv, anti-HbSAg, HbSAg, anti-hav', isSelected: false},
        {id: 6, value: 'Espermograma com capacitação', isSelected: false},
        {id: 7, value: 'Hormonio anti mulleriano (AMH)', isSelected: false},
        {id: 8, value: 'USG para contagem de folículos', isSelected: false}
      ]
    },
    'Trato Urinátio': {
      masterSelected: false,
      items: [
        {id: 1, value: 'EAS + urinocultura + antibiograma', isSelected: false},
        {id: 2, value: 'Cistoscopia', isSelected: false},
        {id: 3, value: 'Estudo Urodinâmico', isSelected: false},
        {id: 4, value: 'Urografia Excretora', isSelected: false}
      ]
    },
    'Outros':{
      masterSelected: false,
      items: [
        {id: 1, value: 'Tomografia de abdome e pelve com contraste', isSelected: false},
        {id: 2, value: 'Uroressonância', isSelected: false},
        {id: 3, value: 'Urotomografia', isSelected: false}
      ]
    }
    
  }
  
  constructor(public imprimirService:ImprimirService){}
  
  checkUncheckAll(group:string) {
    for (var i = 0; i < this.model[group].items.length; i++) {
      this.model[group].items[i].isSelected = this.model[group].masterSelected;
    }
  }

  print(){
    this.pedido.pedidos = []
    for( let elem in this.model){
      this.model[elem].items.forEach( item => {
        if(item.isSelected){
          this.pedido.pedidos.push(item.value)
        }
      })
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
      medico: "",
      crm: ""
    }
  }
}