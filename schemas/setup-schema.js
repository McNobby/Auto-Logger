const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}

const setupSchema = mongoose.Schema({
    _id: reqString,
   actionLog: reqString,
   deletionLog: reqString,
   staffRole: reqString,
   prefix: reqString,
})