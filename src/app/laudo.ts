export interface Laudo {
    nome: string,
    tipo: string,
    data_exame: string
}
export interface LaudoHisteroscopia{
    titulo: string,
    status: string,
    medico: string,
    crm: string,
    nome: string,
    tipo: string,
    data_exame: string,
    paciente: Paciente,
    laudo: Histeroscopia,
    attachments: [],
    descricaoImagens: []
  }

  export interface Paciente {
    nome: string,
    idade: number,
    dia_do_ciclo: number,
    menopausa: boolean,
    amenorreia: boolean,
    hormonio: string,
    indicacao: string,
    medico_assistente: string
  }

  export interface Histeroscopia{
    tipo: string,
    dados_tecnicos: string,
    canal_endocervical: string,
    cavidade_uterina: string,
    istmo: string,
    lesoes_focais: string,
    biopsica: string,
    procedimento_realizado: string,
    observacoes: string,
    impressao_diagnostica: string,
    endometrio: Endometrio,
    ostios_tubarios: OstiosTubarios
  }

  export interface Endometrio{
    cor: string,
    espessura: string,
    vascularizacao: string,
    superficie:string,
    friabilidade: string,
    sangramento_contato: string
  }

  export interface OstiosTubarios{
    direito: string,
    esquerto: string
  }
  
  export interface listLaudo{
    [id: number]: Laudo
  }
