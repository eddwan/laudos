export interface Empresa{
    nome: string,
    endereco: {
        logradouro: string,
        numero: string,
        complemento: string,
        bairro: string,
        cidade: string,
        uf: string,
        cep: string,
    },
    telefones: [],
    email: string,
    website: string,
    logo: {
        url: string,
        data: string,
        content_type: string,
    },
}

export interface Sistema{
    titulo: string,
    user: {
        username: string,
        email: string
    }
    datastore: {
        path: string,
        format: string
    },
    cloud: {
        enabled: boolean,
        autoSync: boolean,
        apiUrl: string,
        apiKey: string
    },
    autocompletar:{
        descricaoImagens: []
    }
}

export interface Pedido {
    nome: string,
    indicacao: string,
    pedidos: string[],
    medico: string,
    crm: string
}
