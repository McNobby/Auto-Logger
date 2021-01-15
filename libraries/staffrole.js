const mongo = require('./mongo')
const mongoose = require('mongoose')
const staffRoleSchema = require('../schemas/staffRole-schema.js')
const NodeChache = require('node-cache')
const myCache = new NodeChache( { stdTTL: 0, checkperiod: 0 } )

module.exports.main = (recievedMessage, typeId, typeRole, type) =>{
  cache(recievedMessage, typeRole, type)

}

async function cache(recievedMessage, typeRole, type){
  const {guild} = recievedMessage
// checks if it is a update from the setup command
  if (type){
    //sets the updated role i cache
    roleCache = myCache.set(guild.id, typeRole)
  }
  //gets cached role, if its not cached it returns undefined
  role = myCache.get( guild.id )

  //if the role isnt cached it has to fetch from the database
  if (!role){
    console.log('Fetching role from database for', guild.name);

    try{
      await mongo().then(async mongoose =>{
        const result = await staffRoleSchema.findOne({_id:`${guild.id}.srole`})
        
        //sets the result in the cache
        role = myCache.set(guild.id, result.staffRole)
  
      })
    }finally{
      mongoose.connection.close()
    }

  }

  //every staffRole check goes through this file
  
  //send slur(recievedMessage)

  //send deletedLog

  //send muted

  //send unmute
}