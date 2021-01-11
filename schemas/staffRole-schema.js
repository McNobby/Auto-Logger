const mongoose = require('mongoose')


const reqString = {
    type: String,
}

const staffRoleSchema = mongoose.Schema({
    _id: reqString,
   staffRole: reqString,

})

module.exports = mongoose.model('server-setup', staffRoleSchema)