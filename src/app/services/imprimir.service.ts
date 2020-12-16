import { Injectable } from '@angular/core';
import { LaudoHisteroscopia, LaudoLaparoscopia } from '../models/laudo';
import { Empresa } from '../models/config';
import jspdf from 'jspdf';
import resizeBase64 from 'resize-base64';
import { ConfigService } from '../services/config.service';

const ipc = require('electron').ipcRenderer
const Jimp = require('jimp');

@Injectable({
  providedIn: 'root'
})
export class ImprimirService {
  empresa: Empresa
  
  constructor(private configService:ConfigService) { 
    this.empresa = this.configService.getData("empresa")
  }
  
  ajustarImagens(files:any){
    return new Promise( (resolved, reject )=>{
      let itemsProcessed = 0;
      
      Object.keys(files).forEach((filename, index, array) => {
        // files[filename].content 
        let buff = new Buffer(files[filename].content.split(';base64,').pop(), 'base64')
        Jimp.read(buff).then( img => {
          // console.log(file.content)
          img.resize(720,Jimp.AUTO).crop(180,20,360,360).brightness(0.15).getBase64(img.getMIME(), (err, res)=>{
            if(err){
              console.error(err)
              reject(err)
            }
            console.log("Ajustando imagem "+filename)
            itemsProcessed++;
            files[filename].content = res
            
          })
          if(itemsProcessed === array.length){
            console.log("IMAGENS AJUSTADAS")
            resolved(files)
          }
        }).catch(err =>{ 
          console.error(err)
          reject(err)
        })
      })
      
    })
  }
  
  gerarLaudoHisteroscopia(laudo: LaudoHisteroscopia, type: string = "singlePage"){
    this.ajustarImagens(laudo.attachments).then( (imagensAjustadas) =>{
      let doc = new jspdf({
        orientation: 'portrait',
        unit: 'mm'
      })
      doc.page = 1;
      // CABEÇALHO 3 CM
      doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
      doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
      // FIM CABEÇALHO
      
      // DADOS PACIENTE 3 CM
      doc.setFontSize(11);
      // LINHA 1 - NOME DO PACIENTE
      doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
      // LINHA 2 - DATA DO EXAME | IDADE | (DUM | DIA DO CICLO) ou MENOPAUSA ou AMENORREIA
      doc.setFontStyle("bold").text(10,35,"Data do exame:").setFontStyle("normal").text(40,35,new Date(laudo.paciente.data_exame).toLocaleDateString());
      doc.setFontStyle("bold").text(70,35,"Idade:").setFontStyle("normal").text(82,35,laudo.paciente.idade.toString());
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
      doc.line(0, 279, 210, 279);
      doc.setFontStyle("normal").setFontSize(8)
      .text(105,282,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
      .text(105,285,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
      if(this.empresa.telefones.length >0){
        doc.text(105,288,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }else{
        doc.text(105,288,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }
      // FIM RODAPÉ
      
      // LAUDO COMPLETO
      var pos_y_laudo = 58;
      //doc.rect(10,pos_y_laudo,138,10);
      if(laudo.laudo.dados_tecnicos != ""){
        doc.setFontSize(11);
        doc.setFontStyle("bold").text(10,pos_y_laudo,"Dados técnicos");
        pos_y_laudo += 4;
        doc.setFontSize(10);
        doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.dados_tecnicos, (type === "singlePage" ? 138 : 190 ) ) );
        pos_y_laudo += 16;
      }
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Canal endocervical");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.canal_endocervical, (type === "singlePage" ? 138 : 190 ) ) );
      pos_y_laudo += 10;
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Cavidade uterina");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.cavidade_uterina, (type === "singlePage" ? 138 : 190 ) ) );
      pos_y_laudo += 10;
      if(laudo.laudo.istmo != ""){
        doc.setFontSize(11);
        doc.setFontStyle("bold").text(10,pos_y_laudo,"Istmo");
        pos_y_laudo += 4;
        doc.setFontSize(10);
        doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.istmo, (type === "singlePage" ? 138 : 190 ) ) );
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
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.lesoes_focais, (type === "singlePage" ? 138 : 190 ) ) );
      if(laudo.laudo.biopsia != ""){
        pos_y_laudo += 14;
        doc.setFontSize(11);
        doc.setFontStyle("bold").text(10,pos_y_laudo,"Biópsia");
        pos_y_laudo += 4;
        doc.setFontSize(10);
        doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.biopsia, (type === "singlePage" ? 138 : 190 ) ) );
      }
      if(laudo.laudo.procedimento_realizado != ""){
        pos_y_laudo += 10;
        doc.setFontSize(11).setFontStyle("bold").text(10,pos_y_laudo,"Procedimento realizado");
        pos_y_laudo += 4;
        doc.setFontSize(10);
        doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.procedimento_realizado, (type === "singlePage" ? 138 : 190 ) ) );
      }
      if(laudo.laudo.observacoes != ""){
        pos_y_laudo += 14;
        doc.setFontSize(11);
        doc.setFontStyle("bold").text(10,pos_y_laudo,"Observações");
        pos_y_laudo += 4;
        doc.setFontSize(10);
        doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.observacoes, (type === "singlePage" ? 138 : 190 ) ) );
      }
      pos_y_laudo += 14;
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,pos_y_laudo,"Impressão diagnóstica");
      pos_y_laudo += 4;
      doc.setFontSize(10);
      doc.setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.impressao_diagnostica, (type === "singlePage" ? 138 : 190 ) ) );
      // FIM LAUDO COMPLETO
      
      if((typeof imagensAjustadas !== 'undefined') && type === "singlePage"){
        var imgCount = 0;
        var linha=50;
        
        Object.keys(imagensAjustadas).forEach((filename) => {
          if(imgCount < 5){
            doc.addImage(imagensAjustadas[filename].content, imagensAjustadas[filename].type, 160, linha, 41, 41, filename, 'FAST').setFontSize(8).text(180,(linha+44),imagensAjustadas[filename].descricao,"center");
            linha += 46;
          }else{
            console.log("Não foi possivel adicionar a imagem: "+filename);
          }
          imgCount++;
        });
      }
      
      if((typeof imagensAjustadas !== 'undefined') && type === "multiplePages"){
        doc.addPage();
        doc.page++;
        // CABEÇALHO 3 CM
        doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
        doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
        // FIM CABEÇALHO
        
        // DADOS PACIENTE 3 CM
        doc.setFontSize(11);
        // LINHA 1 - NOME DO PACIENTE
        doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
        // LINHA 2 - DATA DO EXAME | IDADE | (DUM | DIA DO CICLO) ou MENOPAUSA ou AMENORREIA
        doc.setFontStyle("bold").text(10,35,"Data do exame:").setFontStyle("normal").text(40,35,new Date(laudo.paciente.data_exame).toLocaleDateString());
        doc.setFontStyle("bold").text(70,35,"Idade:").setFontStyle("normal").text(82,35,laudo.paciente.idade.toString());
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
        doc.line(0, 279, 210, 279);
        doc.setFontStyle("normal").setFontSize(8)
        .text(105,282,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
        .text(105,285,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
        if(this.empresa.telefones.length >0){
          doc.text(105,288,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
        }else{
          doc.text(105,288,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
        }
        // FIM RODAPÉ
        
        var imgCount = 1;
        var linha=55;
        Object.keys(imagensAjustadas).forEach((filename) => {
          if(imgCount <= 9){
            switch(imgCount%3){
              case 1:
              doc.addImage(imagensAjustadas[filename].content, imagensAjustadas[filename].type, 10, linha, 60, 60, '', 'FAST').setFontSize(8).text(40,(linha+65),imagensAjustadas[filename].descricao,"center");
              break;
              case 2:
              doc.addImage(imagensAjustadas[filename].content, imagensAjustadas[filename].type, 75, linha, 60, 60, '', 'FAST').setFontSize(8).text(105,(linha+65),imagensAjustadas[filename].descricao,"center");
              break;
              case 0:
              doc.addImage(imagensAjustadas[filename].content, imagensAjustadas[filename].type, 140, linha, 60, 60, '', 'FAST').setFontSize(8).text(170,(linha+65),imagensAjustadas[filename].descricao,"center");
              linha += 68;
              break;
            }
          }else{
            doc.addPage();
            doc.page++;
            // CABEÇALHO 3 CM
            doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
            doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
            // FIM CABEÇALHO
            
            // DADOS PACIENTE 3 CM
            doc.setFontSize(11);
            // LINHA 1 - NOME DO PACIENTE
            doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
            // LINHA 2 - DATA DO EXAME | IDADE | (DUM | DIA DO CICLO) ou MENOPAUSA ou AMENORREIA
            doc.setFontStyle("bold").text(10,35,"Data do exame:").setFontStyle("normal").text(40,35,new Date(laudo.paciente.data_exame).toLocaleDateString());
            doc.setFontStyle("bold").text(70,35,"Idade:").setFontStyle("normal").text(82,35,laudo.paciente.idade.toString());
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
            doc.line(0, 277, 210, 277);
            doc.setFontStyle("normal").setFontSize(8)
            .text(105,280,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
            .text(105,283,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
            if(this.empresa.telefones.length >0){
              doc.text(105,286,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
            }else{
              doc.text(105,286,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
            }
            // FIM RODAPÉ
            
            imgCount = 1;
            linha=55;
            doc.addImage(imagensAjustadas[filename].content, imagensAjustadas[filename].type, 10, linha, 90, 50, '', 'FAST').setFontSize(8).text(55,(linha+55),imagensAjustadas[filename].descricao,"center");
          }
          imgCount++;
        });
      }
      
      let data=doc.output('dataurlstring')
      data = data.split("base64,")
      let fname = new Date(laudo.paciente.data_exame).toLocaleDateString().split("/").join("-") +' - '+laudo.paciente.nome+'.pdf'
      ipc.send('pdfPreview', data[1], fname)
      
    })
  }
  
  getBase64ToImgSrc(file){
    return resizeBase64(file.content, 720, 480);
  }
  
  
  gerarLaudoLaparoscopia(laudo: LaudoLaparoscopia){
    console.log(laudo)
    var doc = new jspdf({
      orientation: 'portrait',
      unit: 'mm'
    })
    doc.page = 1;
    // CABEÇALHO 3 CM
    doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
    doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
    // FIM CABEÇALHO
    
    // DADOS PACIENTE 3 CM
    doc.setFontSize(11);
    doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
    doc.setFontStyle("bold").text(10,35,"Sexo:").setFontStyle("normal").text(22,35,laudo.paciente.sexo);
    doc.setFontStyle("bold").text(45,35,"Idade:").setFontStyle("normal").text(57,35,laudo.paciente.idade.toString());
    doc.setFontStyle("bold").text(67,35,"Data da cirurgia:").setFontStyle("normal").text(99,35,new Date(laudo.paciente.data_exame).toLocaleDateString());
    doc.setFontStyle("bold").text(10,40,"Indicação:").setFontStyle("normal").text(30,40,doc.splitTextToSize(laudo.paciente.indicacao, 170));
    doc.line(0, 50, 210, 50);
    // FIM DADOS PACIENTE
    
    // DADOS MEDICO EXAMINANTE
    doc.setFontSize(11);
    doc.text(105,265,laudo.medico, 'center');
    doc.text(105,270,laudo.crm , 'center');
    doc.setFontSize(8).text(105,276,'Página ' + doc.page,'center');
    // FIM DADOS MEDICO EXAMINANTE
    
    // RODAPÉ 3 CM
    doc.line(0, 277, 210, 277);
    doc.setFontStyle("normal").setFontSize(8)
    .text(105,280,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
    .text(105,283,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
    if(this.empresa.telefones.length >0){
      doc.text(105,286,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
    }else{
      doc.text(105,286,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
    }
    // FIM RODAPÉ
    
    // LAUDO COMPLETO
    var pos_y_laudo = 58;
    doc.setFontSize(11).setFontStyle("bold").text(10,pos_y_laudo,"Cirurgia");
    pos_y_laudo += 5;
    doc.setFontSize(10).setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.cirurgia, 190));
    pos_y_laudo += 25;
    doc.setFontSize(11).setFontStyle("bold").text(10,pos_y_laudo,"Descrição");
    pos_y_laudo += 5;
    doc.setFontSize(10).setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.descricao, 190));
    pos_y_laudo += 120;
    doc.setFontSize(11).setFontStyle("bold").text(10,pos_y_laudo,"Diagnóstico");
    pos_y_laudo += 5;
    doc.setFontSize(10).setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(laudo.laudo.diagnostico, 190));
    // FIM LAUDO COMPLETO
    
    if(typeof laudo.attachments !== 'undefined'){
      doc.addPage();
      doc.page++;
      // CABEÇALHO 3 CM
      doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
      doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
      // FIM CABEÇALHO
      
      // DADOS PACIENTE 3 CM
      doc.setFontSize(11);
      doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
      doc.setFontStyle("bold").text(10,35,"Sexo:").setFontStyle("normal").text(22,35,laudo.paciente.sexo);
      doc.setFontStyle("bold").text(45,35,"Data da cirurgia:").setFontStyle("normal").text(77,35,laudo.paciente.data_exame);
      doc.setFontStyle("bold").text(10,40,"Indicação:").setFontStyle("normal").text(30,40,doc.splitTextToSize(laudo.paciente.indicacao, 170));
      doc.line(0, 50, 210, 50);
      // FIM DADOS PACIENTE
      
      // DADOS MEDICO EXAMINANTE
      doc.setFontSize(11);
      doc.text(105,265,laudo.medico, 'center');
      doc.text(105,270,laudo.crm , 'center');
      doc.setFontSize(8).text(105,276,'Página ' + doc.page,'center');
      // FIM DADOS MEDICO EXAMINANTE
      
      // RODAPÉ 3 CM
      doc.line(0, 277, 210, 277);
      doc.setFontStyle("normal").setFontSize(8)
      .text(105,280,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
      .text(105,283,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
      if(this.empresa.telefones.length >0){
        doc.text(105,286,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }else{
        doc.text(105,286,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }
      // FIM RODAPÉ
      
      var imgCount = 1;
      var linha=55;
      Object.keys(laudo.attachments).forEach((filename) => {
        if(imgCount <= 6){
          if(imgCount%2!=0){
            doc.addImage(this.getBase64ToImgSrc(laudo.attachments[filename]), laudo.attachments[filename].type, 10, linha, 90, 50, '', 'FAST').setFontSize(8).text(55,(linha+55),laudo.attachments[filename].descricao,"center");
          }else{
            doc.addImage(this.getBase64ToImgSrc(laudo.attachments[filename]), laudo.attachments[filename].type, 110, linha, 90, 50, '', 'FAST').setFontSize(8).text(155,(linha+55),laudo.attachments[filename].descricao,"center");
            linha += 65;
          }
        }else{
          doc.addPage();
          doc.page++;
          // CABEÇALHO 3 CM
          doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
          doc.setFontSize(14).setFontStyle("bold").text(105,22,laudo.titulo, 'center');
          // FIM CABEÇALHO
          
          // DADOS PACIENTE 3 CM
          doc.setFontSize(11);
          doc.setFontStyle("bold").text(10,30,"Nome do paciente:").setFontStyle("normal").text(46,30,laudo.paciente.nome);
          doc.setFontStyle("bold").text(10,35,"Sexo:").setFontStyle("normal").text(22,35,laudo.paciente.sexo);
          doc.setFontStyle("bold").text(45,35,"Data da cirurgia:").setFontStyle("normal").text(77,35,laudo.paciente.data_exame);
          doc.setFontStyle("bold").text(10,40,"Indicação:").setFontStyle("normal").text(30,40,doc.splitTextToSize(laudo.paciente.indicacao, 170));
          doc.line(0, 50, 210, 50);
          // FIM DADOS PACIENTE
          
          // DADOS MEDICO EXAMINANTE
          doc.setFontSize(11);
          doc.text(105,265,laudo.medico, 'center');
          doc.text(105,270,laudo.crm , 'center');
          doc.setFontSize(8).text(105,276,'Página ' + doc.page,'center');
          // FIM DADOS MEDICO EXAMINANTE
          
          // RODAPÉ 3 CM
          doc.line(0, 277, 210, 277);
          doc.setFontStyle("normal").setFontSize(8)
          .text(105,280,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
          .text(105,283,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
          if(this.empresa.telefones.length >0){
            doc.text(105,286,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
          }else{
            doc.text(105,286,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
          }
          // FIM RODAPÉ
          
          imgCount = 1;
          linha=55;
          doc.addImage(this.getBase64ToImgSrc(laudo.attachments[filename]), laudo.attachments[filename].type, 10, linha, 90, 50, '', 'FAST').setFontSize(8).text(55,(linha+55),laudo.attachments[filename].descricao,"center");
        }
        imgCount++;
      });
    }
    
    let data=doc.output('dataurlstring')
    data = data.split("base64,")
    let fname = new Date(laudo.paciente.data_exame).toLocaleDateString().split("/").join("-") +' - '+laudo.paciente.nome+'.pdf'
    ipc.send('pdfPreview', data[1], fname)
    
  }
  
  
  gerarPedido(pedido: any){
    var doc = new jspdf({
      orientation: 'portrait',
      unit: 'mm'
    })
    
    doc.page = 1;
    
    pedido.pedidos.forEach( (element, index) => {
      // CABEÇALHO 3 CM
      doc.setFontSize(28).setFontStyle("bold").text(105,15,this.empresa.nome, 'center');
      doc.setFontSize(14).setFontStyle("bold").text(105,22,'Solicitação de exames', 'center');
      // FIM CABEÇALHO
      
      // DADOS PACIENTE 3 CM
      doc.setFontSize(12);
      doc.setFontStyle("bold").text(10,35,"Ao paciente:").setFontStyle("normal").text(40,35,pedido.nome);
      // doc.setFontStyle("bold").text(10,35,"Indicação:").setFontStyle("normal").text(30,40,doc.splitTextToSize(pedido.indicacao, 170));
      doc.line(0, 45, 210, 45);
      // FIM DADOS PACIENTE
      
      // DADOS MEDICO EXAMINANTE
      doc.setFontSize(12);
      doc.text(105,265,pedido.medico.nome, 'center');
      doc.text(105,270,pedido.medico.crm , 'center');
      //doc.setFontSize(8).text(105,276,'Página ' + doc.page,'center');
      // FIM DADOS MEDICO EXAMINANTE
      
      // RODAPÉ 3 CM
      doc.line(0, 277, 210, 277);
      doc.setFontStyle("normal").setFontSize(8)
      .text(105,280,this.empresa.endereco.logradouro + ", " + this.empresa.endereco.numero + " - " + this.empresa.endereco.complemento, 'center')
      .text(105,283,this.empresa.endereco.bairro + " - " + this.empresa.endereco.cidade + " / " + this.empresa.endereco.uf + " - CEP: " + this.empresa.endereco.cep, 'center');
      if(this.empresa.telefones.length >0){
        doc.text(105,286,"Telefones:"+this.empresa.telefones.join(" / ")+" - Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }else{
        doc.text(105,286,"Email: "+this.empresa.email+" - Website: "+this.empresa.website, 'center');
      }
      // FIM RODAPÉ
      
      
      // PEDIDO COMPLETO
      var pos_y_laudo = 58;
      doc.setFontSize(12).setFontStyle("bold").text(10,pos_y_laudo,"Solicito");
      pos_y_laudo += 8;
      doc.setFontSize(12).setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(element, 180));
      pos_y_laudo += 100;
      doc.setFontSize(12).setFontStyle("bold").text(10,pos_y_laudo,"Indicação");
      pos_y_laudo += 8;
      doc.setFontSize(12).setFontStyle("normal").text(10,pos_y_laudo,doc.splitTextToSize(pedido.indicacao, 180));
      
      if (!pedido.pedidos[index + 1]) return;
      doc.addPage();
      doc.page++;
    })
    
    let data=doc.output('dataurlstring')
    data = data.split("base64,")
    ipc.send('pdfPreview', data[1])
    
  }
}
