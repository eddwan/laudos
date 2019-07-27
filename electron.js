const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const ipcMain = electron.ipcMain

const Store = require('electron-store');
const store = new Store();

console.log("Verificando empresa")
if(!store.get("empresa", false)){
  console.log("Não existem dados da empresa. Criando novos dados em branco.")
  store.set({ empresa: {
    nome: "Consultório Médico",
    endereco: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: ""
    },
    telefones: [],
    email: "",
    website: "",
    logo: {
      url: "",
      data: "",
      content_type: ""
    } 
  }})
}

console.log("Verificando sistema")
if(!store.get("sistema", false)){
  console.log("Não existem configurações do sistema. Inicializando confiugração padrão.")
  store.set({ sistema: {
    datastore:{
      path: "~/laudos",
      format: "json"
    },
    cloud: {
      enabled: false,
      autoSync: false,
      apiUrl: "",
      apiKey: ""
    },
    autocompletar:{
      descricaoImagens: []
    }
  }})
}
sistema = store.get("sistema")

// check modelos de laudos
console.log("Verificando modelo de laudo de Laparoscopia")
const laparoscopia = new Store({name: "modeloLaparoscopia"});
if(!laparoscopia.get("modelo", false)){
  console.log("Não existe um modelo de laudo de Laparoscopia. Criando modelo vazio.")
  laparoscopia.set({ modelo: {
    remote_id: "",
    titulo: "Laudo de Videohisteroscopia",
    status: "new",
    medico: "",
    crm: "",
    paciente: {
      nome: "",
      idade: "",
      sexo: "",
      indicacao: ""
    },
    laudo: {
      tipo: "Laparoscopia",
      cirurgia: "",
      descricao: "",
      diagnostico: ""
    },
    attachments: {},
    descricaoImagens: {}
  }})
}

console.log("Verificando modelo de laudo de Histeroscopia")
const histeroscopia = new Store({name: "modeloHisteroscopia"});
if(!histeroscopia.get("modelo", false)){
  console.log("Não existe um modelo de laudo de Histeroscopia. Criando modelo vazio.")
  histeroscopia.set({ modelo: {
    remote_id: "",
    titulo: "Laudo de Videohisteroscopia",
    status: "new",
    medico: "",
    crm: "",
    paciente: {
      nome: "",
      idade: "",
      dia_do_ciclo: 0,
      menopausa: false,
      amenorreia: false,
      hormonio: "",
      indicacao: "",
      medico_assistente: ""
    },
    laudo: {
      tipo: "Histeroscopia",
      dados_tecnicos: "",
      canal_endocervical: "",
      cavidade_uterina: "",
      istmo: "",
      lesoes_focais: "",
      biopsia: "",
      procedimento_realizado: "",
      observacoes: "",
      impressao_diagnostica: "",
      endometrio: {
        cor: "",
        espessura: "",
        vascularizacao: "",
        superficie:"",
        friabilidade: "",
        sangramento_contato: ""
      },
      ostios_tubarios: {
        direito: "",
        esquerdo: ""
      }
    },
    attachments: {},
    descricaoImagens: {}
  }})
}


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let win, serve
const args = process.argv.slice(1)
serve = args.some(val => val === '--serve')

if(sistema.cloud.enabled){
  ipcMain.on('online-status-changed', (event, status) => {
    event.returnValue = status
    win.webContents.send('online-status-changed', status)
  })
}

function createWindow () {
  win = new BrowserWindow({
    width: 1800,
    height: 1200,
    center: true,
    icon: path.join(__dirname, './resources/electron/icons/64x64.png')
  })
  
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    })
    win.loadURL('http://localhost:4200')
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'www/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
  
  win.webContents.openDevTools()
  
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
} catch (e) {
  // Catch Error
  // throw e;
}
