const mongoose = require('mongoose')


const reqString = {
    type: String,
    
}

const actionLogSchema = mongoose.Schema({
    _id: reqString,
   actionLog: reqString,

})

module.exports = mongoose.model('server-setup', actionLogSchema)