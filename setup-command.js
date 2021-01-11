const mongo = require('./mongo')
const mongoose = require('mongoose')
const actionLogSchema = require('./schemas/actionLog-schema')

module.exports = async (arguments, guild, author, channel) => {
    //!Logsetup <type> <channel/role>
    
    const types = ["actionlog", "deletionlog", "staffrole", "alog", "dlog", "srole"]
    //validate arguments
    if (!arguments[0]){
        author.send('You need to supply arguments!')
    }else{
        if (!arguments[1]){
            author.send('you need to supply a role or channel argument')
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
    if (type === "actionlog" || "alog") {
        if (typeChannel){
            await mongo().then(async mongoose => { 
                try{
                   await actionLogSchema.findOneAndUpdate({
                        _id: guild.id
                    },{
                        _id: guild.id,
                        actionLog: typeChannel[1],
                        guild: guild.id,            //follow this,aslo add guild to schemas
                    },{
                        upsert: true
                    })
                }finally{
                    mongoose.connection.close
                }
            })
        }
    }
    else if (type === "deletionlog" || "dlog"){
        if (typeChannel){
            await mongo().then(async mongoose => { 
                try{
                   await setupSchema.findOneAndUpdate({
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        deletionLog: typeChannel[1],
                    },{
                        upsert: true
                    })
                }finally{
                    mongoose.connection.close
                }
            })
        } 
    }
    else if (type === "staffrole" || "srole"){
        if (typeRole){
            await mongo().then(async mongoose => { 
                try{
                   await setupSchema.findOneAndUpdate({
                        _id: guild.id
                    },{
                        _id: guild.id,
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
}


    

