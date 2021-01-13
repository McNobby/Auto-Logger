const mongo = require('./mongo')
const mongoose = require ('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema')
const deleteLogSchema = require('./schemas/deleteLog-schema')

module.exports = (recievedMessage, action, type) => {
    const cache = {}
    if(action === 'send') {
      
        sendLog(type, recievedMessage)
    }
}

sendLog = async (type, recievedMessage) => {
    const { guild } = recievedMessage

if (type === 'slur'){
    try{
        
            await mongo().then(async mongoose => {
                const result = await actionLogSchema.findOne({ _id:`${guild.id}.alog`})
        
                console.log(result.actionLog);
        
                var logChannel = guild.channels.cache.find(
                    channel => channel.id === result.actionLog) 
        
                logChannel.send("BRUH DEY BE SWEARING")
            })
        

    }finally{
        mongoose.connection.close()
    }
}
    else if (type === 'delete') {
        try{
            await mongo().then(async mongoose => {
                const result = await deleteLogSchema.findOne({ _id:`${guild.id}.dlog`})
        
                console.log(result);
        
                var logChannel = guild.channels.cache.find(
                    channel => channel.id === result.deleteLog) 
        
                logChannel.send("BRUH DEY BE deleteing")
            })

        }finally{
            mongoose.connection.close()
        }
    }

}