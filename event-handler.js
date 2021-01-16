const NodeChache = require('node-cache')
const myCache = new NodeChache( { stdTTL: 0, checkperiod: 0 } )
const mongo = require('./libraries/mongo')
const mongoose = require('mongoose')
const staffRoleSchema = require('./schemas/staffRole-schema')
const loggg = require('./send-log')
const embeds = require('./libraries/embeds')

module.exports = async (eventType,  message, role) =>{
    const { guild } =  message
    console.log(eventType);
    // checks if it is a update from the setup command for staffrole
    if (eventType == 'cachestaffrole'){
        //sets the updated role i cache
        roleCache = myCache.set(guild.id, role)
        return
      }

      //gets cached staff role, if its not cached it returns undefined
      staffRole = myCache.get( guild.id )

      //if the staff role isnt cached it has to fetch from the database
      if (!staffRole){
        console.log('FETCHING FROM DB (sRole)');

        try{
          await mongo().then(async mongoose =>{
            const result = await staffRoleSchema.findOne({_id:`${guild.id}.srole`})
            
            //if there is no staffrole in the database it will set the value in cache to null
            if(!result){
                myCache.set(guild.id, null)
            }else{
                myCache.set(guild.id, result.staffRole)
            }

            //sets the result in the cache and gets the new cache
            staffRole = myCache.get( guild.id )
          })
        }finally{
          mongoose.connection.close()
        }

      }
    //if there was a staffrole in cache it will return true and continue
    if(staffRole){
        if(eventType == 'slur'){
            if(!message.member.roles.cache.find(r => r.id === staffRole)){
                //sends a warning that slurs are not tolerated, and deleted the message containing the slur
                message.channel.send("Slurs are not tolerated <@" + message.author.id + ">")
                message.delete()
                .catch(console.error);
        
                //gives the offending member the role named Muted
                let role = message.guild.roles.cache.find(r => r.name === "Muted");
                let member = message.member
                //mutedroleid for test server 793074569433972736
                member.roles.add(role);
                
        
                  //sends slur log embed
                  //send in log channel
                  loggg(message, 'alog', 'slur')
                  embeds.muteDM(message)
            }
        }
    
        else if(eventType == 'delete'){
            if (messageDelete.channel.type == "dm"){
                return
            }else{
                if (messageDelete.member.roles.cache.find(r => r.id === staffRole)){
                    return
                }else{
                    
                     loggg(messageDelete, 'delete')
                }
            }
        }
   
    }else{//this is if what the bot does if there is no staffrole in database
        message.channel.send('`hey admins you need to provide me a staffrole! do !setup help to see how`')
    }
}