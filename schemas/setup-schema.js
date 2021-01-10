const mongoose = require('mongoose')


const reqString = {
    type: String,
    
}

const setupSchema = mongoose.Schema({
    _id: reqString,
   actionLog: reqString,
   deletionLog: reqString,
   staffRole: reqString,

})

module.exports = mongoose.model('server-setup', setupSchema)