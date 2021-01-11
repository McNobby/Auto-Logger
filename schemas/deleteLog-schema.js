const mongoose = require('mongoose')


const reqString = {
    type: String,   
}

//id = guild.id, type

const deleteLogSchema = mongoose.Schema({
    _id: reqString,
   deleteLog: reqString,

})

module.exports = mongoose.model('server-setup', deleteLogSchema)