const mongoose = require('mongoose')


const reqString = {
    type: String,   
}

//id = guild.id, type

const deleteLogSchema = mongoose.Schema({
    _id: reqString,
   deleteLog: reqString,
   guild: reqString,

})

module.exports = mongoose.model('dlog-setup', deleteLogSchema)