const mongo = require('./mongo')
const mongoose = require('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema')
const deleteionLogSchema = require('./schemas/deleteLog-schema')
const staffRoleSchema = require('./schemas/staffRole-schema')

module.exports = async (arguments, guild, author, channel) => {
    //!Logsetup <type> <channel/role>
    
    const types = ["actionlog", "deletionlog", "staffrole", "alog", "dlog", "srole"]
    //validate arguments
    //this checks if there are any arguments
    if (!arguments[0]){
        author.send('You need to supply arguments like `aLog`, `dLog` or `sRole`')
    }else{
        if (!arguments[1]){
            author.send('you need to tell me what channel or role to set')
        }else{
            const type = arguments[0].toLowerCase()
            const arg = arguments[1]

            const typeRole = arg.match(/^<@&(\d+)>$/)
            const typeChannel = arg.match(/^<#?(\d+)>$/)

            if (types.includes(type)){
                if(arg.match(/^<#?(\d+)>$/) || arg.match(/^<@&(\d+)>$/)){
                    saveSetup(type, arg, guild, channel, typeChannel, typeRole)
                    
                }else{
                    author.send("Invalid channel or role tag")
                }
            }else{
                author.send("Invalid type, see `!setuphelp`")
            }
        }
    }
} 

async function saveSetup(type, arg, guild, channel, typeChannel, typeRole){
    const alogAlias = ["alog", "actionlog"]
    const dlogAlias = ["dlog", "deletionlog"]
    const sroleAlias = ["srole", "staffrole"]

    if (alogAlias.includes(type)) {
        console.log("actionLog");
        if (typeChannel){
            const typeId = `${guild.id}.alog`
            await mongo().then(async mongoose => { 
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
    else if (dlogAlias.includes(dlogAlias)){
        console.log("DeletetionLog");
        if (typeChannel){
            const typeId = `${guild.id}.dlog`
            await mongo().then(async mongoose => { 
                try{
                   await deleteionLogSchema.findOneAndUpdate({
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
    else if (sroleAlias.includes(type)){
        if (typeRole){
            const typeId = `${guild.id}.srole`
            await mongo().then(async mongoose => { 
                try{
                   await staffRoleSchema.findOneAndUpdate({
                    _id: typeId
                },{
                    _id: typeId,
                    actionLog: typeRole[1],
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
    else{
        author.send(`Im sorry, but what you tried to do didnt work.. Try again later (error clue: ${guild.id} setup`)
    }
}


    