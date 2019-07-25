import { Injectable } from '@angular/core';
import { LaudoHisteroscopia } from '../models/laudo';
import jspdf from 'jspdf';
import resizeBase64 from 'resize-base64';

@Injectable({
  providedIn: 'root'
})
export class ImprimirService {
  props = {
    config: {
      empresa: {
        nome: "TESTE",
      },
      modelos:{ 
        histeroscopia:{
          titulo: "aa"
        }
      }
    }
  }
  
  constructor() { }
  
  gerarLaudo(laudo: LaudoHisteroscopia){
    console.log(laudo)
    var doc = new jspdf({
      orientation: 'portrait',
      unit: 'mm'
    })
    var empresa = this.props.config.empresa;
    doc.page = 1;
    // CABEÇALHO 3 CM
    doc.setFontSize(28).setFontStyle("bold").text(105,15,empresa.nome, 'center');
    doc.setFontSize(14).setFontStyle("bold").text(105,22,this.props.config.modelos.histeroscopia.titulo, 'center');
    // FIM CABEÇALHO
    
    // DADOS PACIENTE 3 CM
    doc.setFontSize(11);
    // LINHA 1 - NOME DO PACIENTE
    doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
    // LINHA 2 - DATA DO EXAME | IDADE | (DUM | DIA DO CICLO) ou MENOPAUSA ou AMENORREIA
    doc.setFontStyle("bold").text(10,35,"Data do exame:").setFontStyle("normal").text(40,35,new Date(laudo.paciente.data_exame).toLocaleDateString());
    doc.setFontStyle("bold").text(70,35,"Idade:").setFontStyle("normal").text(82,35,laudo.paciente.idade);
    if(laudo.paciente.amenorreia){
      doc.setFontStyle("bold").text(92,35,"Amenorréia: ").setFontStyle("normal").text(117,35,"Sim");
    }else{
      if(laudo.paciente.menopausa){
        doc.setFontStyle("bold").text(92,35,"Menopausa:").setFontStyle("normal").text(117,35,"Sim");
      }else{
        doc.setFontStyle("bold").text(92,35,"DUM:").setFontStyle("normal").text(103,35,new Date(laudo.paciente.data_ultima_menstruacao).toLocaleDateString());
        doc.setFontStyle("bold").text(130,35,"Dia do Ciclo:").setFontStyle("normal").text(155,35,String(laudo.paciente.dia_do_ciclo));
      }
    }
    // LINHA 3 - MEDICO ASSISTENTE | ANTICONCEPCIONAL
    doc.setFontStyle("bold").text(10,40,"Médico Assistente:").setFontStyle("normal").text(47,40,laudo.paciente.medico_assistente);
    if(laudo.paciente.hormonio != null){
      doc.setFontStyle("bold").text(105,40,"Anticoncepcional:").setFontStyle("normal").text(140,40,laudo.paciente.hormonio);
    }
    // LINHA 4 E 5 - INDICAÇÃO (QUEBRADO EM DUAS LINHAS)
    doc.setFontStyle("bold").text(10,45,"Indicação:").setFontStyle("normal").text(30,45,doc.splitTextToSize(laudo.paciente.indicacao, 175));
    
    doc.line(0, 50, 210, 50);
    // FIM DADOS PACIENTE
    
    // DADOS MEDICO EXAMINANTE
    doc.setFontSize(11);
    doc.text(105,265,laudo.medico, 'center');
    doc.text(105,270,laudo.crm , 'center');
    doc.setFontSize(8).text(105,276,'Página ' + doc.page,'center');
    // FIM DADOS MEDICO EXAMINANTE
    
    // RODAPÉ 3 CM
    // doc.line(0, 277, 210, 277);
    // doc.setFontStyle("normal").setFontSize(8)
    // .text(105,280,empresa.endereco.logradouro + ", " + empresa.endereco.numero + " - " + empresa.endereco.complemento, 'center')
    // .text(105,283,empresa.endereco.bairro + " - " + empresa.endereco.cidade + " / " + empresa.endereco.uf + " - CEP: " + empresa.endereco.cep, 'center');
    // if(empresa.telefones.length >0){
    //     doc.text(105,286,"Telefones:"+empresa.telefones.join(" / ")+" - Email: "+empresa.email+" - Website: "+empresa.website, 'center');
    // }else{
    //     doc.text(105,286,"Email: "+empresa.email+" - Website: "+empresa.website, 'center');
    // }
    // FIM RODAPÉ
    
    // LAUDO COMPLETO
    var pos_y_laudo = 58;
    //doc.rect(10,pos_y_laudo,138,10);
    if(laudo.laudo.dados_tecnicos != ""){
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Dados técnicos");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.dados_tecnicos, 138));
      pos_y_laudo += 16;
    }
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Canal endocervical");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.canal_endocervical, 138));
    pos_y_laudo += 10;
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Cavidade uterina");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.cavidade_uterina, 138));
    pos_y_laudo += 10;
    if(laudo.laudo.istmo != ""){
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Istmo");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.istmo, 138));
      pos_y_laudo += 13;
    }
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Endométrio");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("bold").text(15,pos_y_laudo,"Cor:").setFontStyle("normal").text(23,pos_y_laudo,laudo.laudo.endometrio.cor);
    doc.setFontStyle("bold").text(68,pos_y_laudo,"Espessura:").setFontStyle("normal").text(88,pos_y_laudo,laudo.laudo.endometrio.espessura);
    pos_y_laudo += 4;
    doc.setFontStyle("bold").text(15,pos_y_laudo,"Superfície:").setFontStyle("normal").text(34,pos_y_laudo,laudo.laudo.endometrio.superficie);
    doc.setFontStyle("bold").text(68,pos_y_laudo,"Sangr. de Contato:").setFontStyle("normal").text(101,pos_y_laudo,laudo.laudo.endometrio.sangramento_contato);
    pos_y_laudo += 4;
    doc.setFontStyle("bold").text(15,pos_y_laudo,"Vascularização:").setFontStyle("normal").text(43,pos_y_laudo,laudo.laudo.endometrio.cor);
    doc.setFontStyle("bold").text(68,pos_y_laudo,"Friabilidade:").setFontStyle("normal").text(90,pos_y_laudo,laudo.laudo.endometrio.friabilidade);
    pos_y_laudo += 6;
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Óstios tubários");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("bold").text(15,pos_y_laudo,"Direito:").setFontStyle("normal").text(28,pos_y_laudo,laudo.laudo.ostios_tubarios.direito);
    doc.setFontStyle("bold").text(68,pos_y_laudo,"Esquerdo:").setFontStyle("normal").text(86,pos_y_laudo,laudo.laudo.ostios_tubarios.esquerdo);
    pos_y_laudo += 6;
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Lesões focais");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.lesoes_focais, 138));
    if(laudo.laudo.biopsia != ""){
      pos_y_laudo += 14;
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Biópsia");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.biopsia, 138));
    }
    if(laudo.laudo.procedimento_realizado != ""){
      pos_y_laudo += 10;
      doc.setFontSize(11).setFontStyle("bold").text(10,pos_y_laudo,"Procedimento realizado");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.procedimento_realizado, 138));
    }
    if(laudo.laudo.observacoes != ""){
      pos_y_laudo += 14;
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Observações");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.observacoes, 138));
    }
    pos_y_laudo += 14;
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,pos_y_laudo,"Impressão diagnóstica");
    pos_y_laudo += 4;
    doc.setFontSize(10);
    doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.impressao_diagnostica, 138));
    // FIM LAUDO COMPLETO
    
    if(typeof laudo.attachments !== 'undefined'){
      var imgCount = 0;
      var linha=55;
      
      Object.keys(laudo.attachments).forEach((filename) => {
        if(imgCount < 6){
          doc.addImage(this.getBase64ToImgSrc(laudo.attachments[filename]), laudo.attachments[filename].type, 150, linha, 50, 29, filename, 'FAST').setFontSize(8).text(175,(linha+32),laudo.descricaoImagens[filename].descricao,"center");
          linha += 35;
        }else{
          console.log("Não foi possivel adicionar a imagem: "+filename);
        }
        imgCount++;
      });
    }
    doc.save(new Date(laudo.paciente.data_exame).toLocaleDateString()+' - '+laudo.paciente.nome+'.pdf');
  }
  
  getBase64ToImgSrc(file){
    // return resizeBase64("data:"+file.type+";base64, "+file.content, 720, 480);
    return resizeBase64(file.content, 720, 480);
  }
}