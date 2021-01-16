const mongo = require('./libraries/mongo.js')
const mongoose = require('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema.js')
const deleteionLogSchema = require('./schemas/deleteLog-schema.js')
const staffRoleSchema = require('./schemas/staffRole-schema')
const cacherole = require('./commands')
const logs = require('./send-log')
const eventHandler = require('./event-handler')


const cache = {}

module.exports.setup = async (arguments, recievedMessage) => {
    const {guild, author, channel} = recievedMessage

    // !setup <type> <channel/role>
    
    const types = ["actionlog", "deletionlog", "staffrole", "alog", "dlog", "srole"]
    //validate arguments
    //this checks if there are any arguments
    if (!arguments[0]){
        author.send('You need to provide arguments like; `aLog`, `dLog` or `sRole`')
    }else{
        //checks if secondary argument is submitted
        if (!arguments[1]){
            author.send('You need to tell me what channel or role to set first.')
        }else{
            //separates the argument array
            const type = arguments[0].toLowerCase()
            const arg = arguments[1]
            
            //gets the channel id from the tag
            const typeRole = arg.match(/^<@&(\d+)>$/)
            const typeChannel = arg.match(/^<#?(\d+)>$/)

            if (types.includes(type)){
                if(arg.match(/^<#?(\d+)>$/) || arg.match(/^<@&(\d+)>$/)){
                    saveSetup(type, arg, guild, channel, typeChannel, typeRole, author, recievedMessage)
                    
                }else{
                    author.send("Invalid channel or role tag.")
                }
            }else{
                author.send("Invalid type, see `!setuphelp`")
            }
        }
    }
} 

async function saveSetup(type, arg, guild, channel, typeChannel, typeRole, author, recievedMessage){
    const alogAlias = ["alog", "actionlog"]
    const dlogAlias = ["dlog", "deletionlog"]
    const sroleAlias = ["srole", "staffrole"]

    if (alogAlias.includes(type)) {
        console.log("actionLog");
        if (typeChannel){
            const typeId = `${guild.id}.alog`
            await mongo().then(async mongoose => { 
                logs(recievedMessage, 'cache', 'alog', typeChannel[1])
                try{
                    
                   await actionLogSchema.findOneAndUpdate({
                        _id: typeId
                    },{
                        _id: typeId,
                        actionLog: typeChannel[1],
                        guild: guild.id,            
                    },{
                        upsert: true
                    })
                }finally{
                    mongoose.connection.close
                }
            })
        }
    }
    else if (dlogAlias.includes(type)){
        console.log("DeletetionLog");
        if (typeChannel){
            const typeId = `${guild.id}.dlog`
            await mongo().then(async mongoose => {
                logs(recievedMessage, 'cache', 'dlog', typeChannel[1])
                try{
                   await deleteionLogSchema.findOneAndUpdate({
                    _id: typeId
                },{
                    _id: typeId,
                    deleteLog: typeChannel[1],
                    guild: guild.id, 
                    },{
                        upsert: true
                    })
                }finally{
                    mongoose.connection.close
                }
            })
        } 
    }
    else if (sroleAlias.includes(type)){
        if (typeRole){
            const typeId = `${guild.id}.srole`
            cacherole.command(recievedMessage, 'cachestaffrole', typeRole[1])
            eventHandler('cachestaffrole' ,recievedMessage, typeRole[1])
            await mongo().then(async mongoose => { 
                try{
                   await staffRoleSchema.findOneAndUpdate({
                    _id: typeId
                    },{
                    _id: typeId,
                    staffRole: typeRole[1],
                    
                    },{
                        upsert: true
                    })
                }finally{
                    mongoose.connection.close
                }
            })
        }
    }
    else{
        author.send(`I'm sorry, I was unable to do that. Try again later! (error clue: ${guild.id} setup) If you think this should work, contact our developers on GitHub.`)
    }
}


    
