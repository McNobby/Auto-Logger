const mongoose = require('mongoose')


const reqString = {
    type: String,
    
}

const actionLogSchema = mongoose.Schema({
    _id: reqString,
   actionLog: reqString,
   guild: reqString,
})

module.exports = mongoose.model('alog-setup', actionLogSchema)