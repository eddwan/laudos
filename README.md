# Sistema de Laudos

Sistema de laudos desenvolvido para a clínica de Ginecologia da Dra. Marcela Andrade (https://www.doutoramarcelaandrade.com.br) para atender a demanda de laudos dos seguintes exames:
* Histeroscopia Clínica
* Histeroscopia Cirúgica
* Cirurgia Video-laparoscópica

## Suporte as plataformas

* [x] Windows 10
* [x] Windows 7
* [x] MacOS X Sierra

## Suporte aos bancos de dados

* [x] Local (JSON files)
* [X] Remoto (REST-API running on AWS API Gateway, Lambda and Mongo)

## Funcionalidades

* [x] Inclusão de laudos
* [x] Customização de informações de empresa, médico e laudo
* [x] Exportação no formato PDF
* [x] Suporte a imagens
* [X] Envio manual dos laudos para REST API
* [X] Sincronização automática com REST API
* [X] Versionamento dos documents no banco de dados e no S3 Bucket

## Melhorias planejadas
* [ ] Criação de outros templates de laudos

---

## Credits

This application was built using the [Electron Framework](http://electron.atom.io/) :heart: for creating desktop apps and [Ionic Framework](http://ionicframework.com/) :heart: for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications.

The app was inspired by:

[Angular Electron Shell](https://github.com/maximegris/angular-electron) :punch:

[Simple Cryptor Pouch Plugin](https://www.npmjs.com/package/simple-cryptor-pouch) (forked to create the [polyonic-secure-pouch](https://github.com/paulsutherland/polyonic-secure-pouch) plugin). :pray:

## License

Released under the MIT license.
