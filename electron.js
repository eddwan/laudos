const {app, BrowserWindow, Menu, ipcMain, shell, systemPreferences} = require('electron')
const path = require('path')
const url = require('url')
const isMac = process.platform === 'darwin'
const os = require("os");

console.log("IS CAMERA ENABLED? ", systemPreferences.getMediaAccessStatus("camera"))
if(systemPreferences.getMediaAccessStatus("camera") != "granted"){
  systemPreferences.askForMediaAccess("camera").then( res =>{
    console.log("IS CAMERA ENABLED? ", res, systemPreferences.getMediaAccessStatus("camera"))
  })
}

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { label: 'Configurações' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Novo Laudo',
        submenu: [
          { 
            label: 'Histeroscopia',
            accelerator: 'Shift+CmdOrCtrl+H'
          },
          { 
            label: 'Laparoscopia',
            accelerator: 'Shift+CmdOrCtrl+L'
          }
        ]
      },
      // isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: "Editar",
    submenu: [
      { label: "Desfazer", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Refazer", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Recortar", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copiar", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Colar", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Selecionar Tudo", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]},
    // { role: 'viewMenu' }
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  
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
  
  userinfo = os.userInfo();
  hostname = os.hostname();
  
  console.log("Verificando sistema")
  if(!store.get("sistema", false)){
    console.log("Não existem configurações do sistema. Inicializando confiugração padrão.")
    store.set({ sistema: {
      user: {
        username: userinfo.username,
        email: userinfo.username+"@"+hostname
      },
      datastore:{
        path: userinfo.homedir+"/laudos/",
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
      _id: "",
      titulo: "Laudo de Cirurgia Videolaparoscópica",
      status: "new",
      version: "",
      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
      medico: "",
      crm: "",
      paciente: {
        nome: "",
        idade: "",
        data_exame: "",
        sexo: "",
        indicacao: ""
      },
      laudo: {
        tipo: "Laparoscopia",
        cirurgia: "",
        descricao: "",
        diagnostico: ""
      },
      attachments: {}
    }})
  }
  
  console.log("Verificando modelo de laudo de Histeroscopia")
  const histeroscopia = new Store({name: "modeloHisteroscopia"});
  if(!histeroscopia.get("modelo", false)){
    console.log("Não existe um modelo de laudo de Histeroscopia. Criando modelo vazio.")
    histeroscopia.set({ modelo: {
      _id: "",
      titulo: "Laudo de Video-Histeroscopia Diagnóstica",
      status: "new",
      version: "",
      created_at: "",
      created_by: "",
      updated_at: "",
      updated_by: "",
      medico: "",
      crm: "",
      paciente: {
        nome: "",
        idade: "",
        data_exame: "",
        data_ultima_menstruacao: "",
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
      attachments: {}
    }})
  }
  
  console.log("Verificando modelo de Pedidos de exames")
  const pedidos = new Store({name: "modeloPedidos"});
  if(!pedidos.get("modelo", false)){
    console.log("Não existe um modelo de Pedidos. Criando modelo vazio.")
    pedidos.set({ modelo: {
      medico:{
        notListed: true,
        nome: '',
        crm: ''
      },
      'Rotina Ginecológica' : {
        masterSelected: false,
        items: [
          {value: 'Citologia Oncótica', isSelected: false},
          {value: 'Ultrassonografia transvaginal', isSelected: false},
          {value: 'Mamografia', isSelected: false},
          {value: 'Ultrassonografia de mamas', isSelected: false},
          {value: 'Ultrassonografia de abdome total', isSelected: false},
          {value: 'EAS + urinocultura + antibiograma', isSelected: false},
          {value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
          {value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false},
          {value: 'Marcadores tumorais: CA124, CEA, alfa feto proteína, beta hcg, CA 19.9', isSelected: false},
        ]
      },
      'Endometriose':{
        masterSelected: false,
        items: [
          {value: 'Ressonância de pelve com preparo', isSelected: false},
          {value: 'Retossigmóideoscopia', isSelected: false},
          {value: 'Ultrassom de rins e vais urinárias', isSelected: false},
          {value: 'CA125', isSelected: false},
          {value: 'Histeroscopia com biópsia sob sedação', isSelected: false},
          {value: 'EAS + urinocultura + antibiograma', isSelected: false},
          {value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
          {value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false}
        ]
      },
      'Infertilidade':{
        masterSelected: false,
        items: [
          {value: 'Histeroscopia', isSelected: false},
          {value: 'Histerossalpingografia', isSelected: false},
          {value: 'Laboratório:  hemograma, coagulograma, glicemia de jejum, lipidograma, função hepática, função renal, vitamina D', isSelected: false},
          {value: 'Hormonal: TSH, T4L, FSH, estradiol, progesterona, estradiol, prolactina, testosterona total e frações, SHGB, insulina', isSelected: false},
          {value: 'Sorologias: anti-hiv, vdrl, anti-hcv, anti-HbSAg, HbSAg, anti-hav', isSelected: false},
          {value: 'Espermograma com capacitação', isSelected: false},
          {value: 'Hormonio anti mulleriano (AMH)', isSelected: false},
          {value: 'USG para contagem de folículos', isSelected: false}
        ]
      },
      'Trato Urinátio': {
        masterSelected: false,
        items: [
          {value: 'EAS + urinocultura + antibiograma', isSelected: false},
          {value: 'Cistoscopia', isSelected: false},
          {value: 'Estudo Urodinâmico', isSelected: false},
          {value: 'Urografia Excretora', isSelected: false}
        ]
      },
      'Outros':{
        masterSelected: false,
        items: [
          {value: 'Tomografia de abdome e pelve com contraste', isSelected: false},
          {value: 'Uroressonância', isSelected: false},
          {value: 'Urotomografia', isSelected: false}
        ]
      }  
    }})
  }
  
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
  
  let win, serve
  const args = process.argv.slice(1)
  serve = args.some(val => val === '--serve')
  
  function createWindow () {
    win = new BrowserWindow({
      width: 1800,
      height: 1200,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      },
      center: true,
      titleBarStyle: 'hiddenInset',
      icon: path.join(__dirname, './resources/electron/icons/64x64.png')
    })
    
    win.maximize();
    
    // [1]->sub->[0]->sub->[0]
    // file -> novo -> histeroscopia
    menu.items[0].submenu.items[2].click = () => {
      win.webContents.send("navigate-to", "/tabs/configuracoes")
    }
    menu.items[1].submenu.items[0].submenu.items[0].click = () => {
      win.webContents.send("navigate-to", "/histeroscopia")
    }
    menu.items[1].submenu.items[0].submenu.items[1].click = () => {
      win.webContents.send("navigate-to", "/laparoscopia")
    }
    
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
    
    ipcMain.on('online-status', (event, status) => {
      setTimeout( () => {
        console.log("Set online-status to", status);
        global.isOnline = status
        win.webContents.send('online-status', status);
      }, 3000)
    })  
    
    ipcMain.on('reloadApp', (event)=>{
      win.webContents.reload();
    })

    ipcMain.on('pdfPreview', (event, data, fname='temp.pdf')=>{
      
      const filename = path.join(app.getPath('temp'),fname)
      try{
        const fs = require('fs')
        let ws = fs.createWriteStream(filename)
        ws.write(data, 'base64')
        ws.on('finish', ()=>{
          console.log("finishe write " + filename)
        })
        
      }catch(error){
        console.log(error)
      }
      
      shell.openPath(filename).then( ()=>{
        win.webContents.send('finishPreview', 'ok')
      })
    })
    
    // win.webContents.openDevTools()
    
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
  