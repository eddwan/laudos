export interface Laudo {
  nome: string,
  tipo: string,
  data_exame: string
}

export interface listLaudo{
  [id: number]: Laudo
}

export interface LaudoDataTableItem {
  filename: string,
  nome: string,
  tipo: string,
  data_exame: string,
  status: string
}

export interface LaudoRemote {
  nome: string,
  tipo: string
}

export interface LaudoHisteroscopia{
  remote_id: string,
  titulo: string,
  status: string,
  medico: string,
  crm: string,
  paciente: {
    nome: string,
    idade: number,
    data_exame: string,
    data_ultima_menstruacao: string,
    dia_do_ciclo: number,
    menopausa: boolean,
    amenorreia: boolean,
    hormonio: string,
    indicacao: string,
    medico_assistente: string
  },
  laudo: {
    tipo: string,
    dados_tecnicos: string,
    canal_endocervical: string,
    cavidade_uterina: string,
    istmo: string,
    lesoes_focais: string,
    biopsia: string,
    procedimento_realizado: string,
    observacoes: string,
    impressao_diagnostica: string,
    endometrio: {
      cor: string,
      espessura: string,
      vascularizacao: string,
      superficie:string,
      friabilidade: string,
      sangramento_contato: string
    },
    ostios_tubarios: {
      direito: string,
      esquerdo: string
    }
  },
  attachments: {},
  descricaoImagens: {}
}

export interface LaudoLaparoscopia{
  remote_id: string,
  titulo: string,
  status: string,
  medico: string,
  crm: string,
  paciente: {
    nome: string,
    idade: number,
    data_exame: string,
    sexo: string,
    indicacao: string
  },
  laudo: {
    tipo: string,
    cirurgia: string,
    descricao: string,
    diagnostico: string
  },
  attachments: {},
  descricaoImagens: {}
}
