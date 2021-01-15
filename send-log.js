const mongo = require('./libraries/mongo')
const mongoose = require ('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema')
const deleteLogSchema = require('./schemas/deleteLog-schema')
const embeds = require('./libraries/embeds')

module.exports = (recievedMessage, action, type, data) => {
    const cache = {}
    if(action === 'send') {
        sendLog(type, recievedMessage)
    }
}

sendLog = async (type, recievedMessage) => {
    const { guild, content, author, channel } = recievedMessage

    if (type === 'slur'){
        try{

                await mongo().then(async mongoose => {
                    const result = await actionLogSchema.findOne({ _id:`${guild.id}.alog`})

                
                    var logChannel = guild.channels.cache.find(
                        channel => channel.id === result.actionLog) 
                    
                    embeds.slur(recievedMessage, logChannel)
                })
            
        }finally{
            mongoose.connection.close()
        }
    }
    else if (type === 'delete') {
        try{
            await mongo().then(async mongoose => {
                const result = await deleteLogSchema.findOne({ _id:`${guild.id}.dlog`})
        
        
                var logChannel = guild.channels.cache.find(
                    channel => channel.id === result.deleteLog) 
        
                logChannel.send(`Message: "${content}" from ${author.toString()} was deleted in ${channel.toString()}`)
            })

        }finally{
            mongoose.connection.close()
        }
    }
}