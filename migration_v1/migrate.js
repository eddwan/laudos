/// set 2 environment variables:
/// POUCHDB_URL : with the pouchDB files path or server HTTP URL
/// LAUDOS_MIGRATE_OUTPUT: target where the JSON files must be recorded.

var fs = require('fs')
var PouchDB = require('pouchdb')
var replicationStrem = require('pouchdb-replication-stream')
var cryto = require('crypto')
var uuid = require('uuid')
var moment = require('moment');
moment().format();

PouchDB.plugin(replicationStrem.plugin);
PouchDB.adapter('writableStream', replicationStrem.adapters.writableStream);

var db = new PouchDB(process.env.POUCHDB_URL)

db.info().then( function ( info ) {
    console.log(info)
})

db.allDocs({include_docs: true, attachments: true}).then(function(res){
    var i = 1
    res.rows.forEach(function(row){
        var doc = {
            _id: '',
            titulo: 'Laudo de '+row.doc.laudo.tipo,
            created_at: row.doc._id,
            created_by: 'marcelaugf@gmail.com',
            paciente: row.doc.paciente,
            laudo: row.doc.laudo,
            medico: row.doc.medico,
            crm: row.doc.crm
        }
        var files = row.doc._attachments
        var attachments = {}

        if(files){
            Object.keys(files).forEach(function(file){
                // generate uuid
                var attachuuid = uuid.v4()
                var content = "data:"+files[file].content_type+";base64,"+files[file].data

                let buff = new Buffer(content, 'base64');
                // add attachments
                attachments[attachuuid] = {
                    type: files[file].content_type,
                    readMode: 2,
                    name: attachuuid,
                    size: buff.byteLength,
                    descricao: row.doc.descricaoImagens[file].descricao,
                    content: content
                }
            })
        }
        
        doc['attachments'] = attachments

        // date and time adjustments 
        console.log(row.doc.paciente.nome+" | "+ row.doc.paciente.data_exame + " | " + row.doc.paciente.data_ultima_menstruacao)
        doc['paciente']['data_exame'] = moment(row.doc.paciente.data_exame, 'DD/MM/YYYY').toJSON()
        doc['paciente']['data_ultima_menstruacao'] = moment(row.doc.paciente.data_ultima_menstruacao, 'DD/MM/YYYY').toJSON()
        
        var version = cryto.createHash('md5').update(JSON.stringify(doc)).digest("hex");
        doc['version']=version
        doc['updated_by']='dra.marcela.andrade@institutoalmeidaandrade.com.br'
        doc['updated_at']=row.doc.atualizado_em
        doc['status']='local-saved'
        
        var filename = uuid.v4()+".json"
        console.log(i.toString() + " | " + filename +" | Nome: " + row.doc.paciente.nome)

        fs.writeFile(process.env.LAUDOS_MIGRATE_OUTPUT+filename, JSON.stringify(doc), 'utf8', function(err){
            console.log(err)
        });
        i++;
    })
})
