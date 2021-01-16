const mongo = require('./libraries/mongo')
const mongoose = require ('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema')
const deleteLogSchema = require('./schemas/deleteLog-schema')
const embeds = require('./libraries/embeds')

const NodeChache = require('node-cache')
const myCache = new NodeChache( { stdTTL: 0, checkperiod: 0 } )

module.exports = async (recievedMessage, type, log, roleId) => {
    const { guild, content, author, channel } = recievedMessage

    if (type === 'cache'){
        if (log == 'alog'){
            alogCache = myCache.set(`${guild.id}.alog`, roleId)
            
        }else{//guaranteed dlog
            dlogCache = myCache.set(`${guild.id}.dlog`, roleId)
        }
    }

    if (type === 'alog'){
        role = myCache.get((`${guild.id}.alog`))
        if (!role){
            try{

                await mongo().then(async mongoose => {
                    console.log('FETCHING FROM DB (ALOG)');
                    const result = await actionLogSchema.findOne({ _id:`${guild.id}.alog`})
                    
                   
                    if (!result){
                        alogCache = myCache.set(`${guild.id}.alog`, null)
                    }else{
                        alogCache = myCache.set(`${guild.id}.alog`, result.actionLog)
                    }
                    
                    });
            }finally{
                mongoose.connection.close()
            }
        }

        alog = myCache.get((`${guild.id}.alog`))

        if(alog){
            if(log == 'slur'){
            
                embeds.slur(recievedMessage, alog)
            }
            else if (log == 'mute'){
                //typeId is the muted person in this case
                embeds.muteLog(recievedMessage, alog, roleId)
            }
            else if(log == 'unmute'){
                embeds.unMuteLog(recievedMessage, alog, roleId)
            }
        }else{
            recievedMessage.channel.send('`no logging channel set!`')
        }


    }
    else if (type === 'delete') {
        dlog = myCache.get((`${guild.id}.dlog`))
        if (!dlog){
            try{
                await mongo().then(async mongoose => {
                    console.log('FETCHING FROM DB (DLOG)')
                    const result = await deleteLogSchema.findOne({ _id:`${guild.id}.dlog`})
            
                    dlogCache = myCache.set(`${guild.id}.dlog`, result.deleteLog)
                })
            }catch{ 
                console.log('unable to log deletion, only a occasional one time issue');
            }finally{
                mongoose.connection.close()
            }
        }
        dlog = myCache.get((`${guild.id}.dlog`))
        if(dlog){

            var logChannel = guild.channels.cache.find(
                channel => channel.id === dlog) 
    
            logChannel.send(`Message: "${content}" from ${author.toString()} was deleted in ${channel.toString()}`)
        }
    }
}

