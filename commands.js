const Discord = require('discord.js')
const client = new Discord.Client()
const app = require('./app.js')
const { logChannel, mutedRole, adminRole } = require('./config.json')
const reason = null
const setup = require('./setup-command')
const sendLog = require('./send-log')
const embeds = require('./libraries/embeds')

const NodeChache = require('node-cache')
const myCache = new NodeChache( { stdTTL: 0, checkperiod: 0 } )
const mongo = require('./libraries/mongo')
const mongoose = require('mongoose')
const staffRoleSchema = require('./schemas/staffRole-schema')

//command handler
//to add a new command, just add a new else if statement
//example:
//else if (primaryCommand == "newCommand (without the prefix) "){
//  logic    
//}

module.exports.command = async (recievedMessage, primaryCommand, arguments) => {

    //deconstructs relevant properties
    const { content, author, guild, channel, member} = recievedMessage

    let pCmd = primaryCommand.toLowerCase();

    //this checks if there is a Muted role in the guild, if not it will make one
        if(!guild.roles.cache.find(r => r.name === "Muted")){
        guild.roles.create({
            data: {
                name: 'Muted',
            },
            reason: 'muted role for members that are muted, You will have to configure permissions yourself!'
        })
    }

// checks if it is a update from the setup command for staffrole
  if (pCmd == 'cachestaffrole'){
    //sets the updated role i cache
    roleCache = myCache.set(guild.id, arguments)
    console.log(arguments, ' set as srole');
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
            staffRole = myCache.set(guild.id, null)
        }else{
            staffRole = myCache.set(guild.id, result.staffRole)
        }

        //sets the result in the cache and gets the new cache
        staffRole = myCache.get( guild.id )
      })
    }finally{
      mongoose.connection.close()
    }

  }


    if (pCmd == "setup"){
        if (member.permissions.has('ADMINISTRATOR')){

            if(!arguments.includes('help')){
                setup.setup(arguments, recievedMessage)
            }else{
                embeds.setupHelp(recievedMessage)

            }
            
           
        }else{
            console.log('no admin ;-;');
        }return
    }
    

    else if (pCmd == "intro"){
        if (member.permissions.has('ADMINISTRATOR')){
            embeds.staffIntro(recievedMessage)
            recievedMessage.delete()
        }

    }

    //admin commands can be above this check
    //this checks if there is a role in cache, 
    //if there isn't it has to be that there is no entry in the database
    if(staffRole){
   //provides a list of staff commands (!staffhelp)
if (pCmd == 'staffhelp') {
    //checks if author is staff
    if (recievedMessage.member.roles.cache.find(r => r.id === staffRole)){
        recievedMessage.delete()
        embeds.staffHelp(recievedMessage)
    }
    else{
        //sends DM if the author isnt a staff member
        console.log(`${recievedMessage.author.username} is not a staff member(tried to use staffhelp)`);
        recievedMessage.delete()
        recievedMessage.author.send(`${recievedMessage.author.toString()} You don't have access to that command!`)
        
    }
}


// unmute command -- its smart to collapse this if possible to save space on the screen
else if (pCmd == 'unmute') {
    if (recievedMessage.member.roles.cache.find(r => r.id === staffRole)){
        //checks if there is any arguments
        if(arguments != ''){
        //parameters to check if there is a valid ping
        const mention = arguments[0].match(/^<@!?(\d+)>$/)
            //checks if there is a valid ping
            if (mention){
                let role = recievedMessage.guild.roles.cache.find(r => r.name === mutedRole);
                let member = recievedMessage.mentions.members.first();
              
                //checks if the pinged member is muted
                if (member.roles.cache.some(rolee => rolee.name === mutedRole)){
                    //removes the muted role of the pinged  and deletes the prompted command
                    member.roles.remove(role);
                    recievedMessage.delete()
                    
                    //finds the log channel from the channel name in config
                    if (recievedMessage.channel.type == 'text') {
                        var logger = recievedMessage.guild.channels.cache.find(
                            channel => channel.name === logChannel
                    );
                        if (logger) { 

                            //sends mute log embed
                           sendLog(recievedMessage, 'alog', 'unmute', member)
                           //sends a dm to the muted member saying they have been muted
                           embeds.unMmuteDm(recievedMessage)
 
                        }
                    }                             
                }
                else{
                    console.log(`${recievedMessage.author.username} tried to unmute someone that isnt muted`);
                    recievedMessage.delete()
                    recievedMessage.author.send(`${recievedMessage.author.toString()} That member isnt muted! Someone might have already unmuted them, or they might have mute evaded!`)
                }
            }  else{
                //sends DM if the argument isnt a valid ping
                console.log(`${recievedMessage.author.username} didnt provide a valid ping(unmute)`);
                recievedMessage.delete()
                recievedMessage.author.send(`${recievedMessage.author.toString()} You have to provide a valid ping, just like the one at the start of this sentence`)
            }
        }  else {
            //sends DM if there is no arguments
            console.log(`${recievedMessage.author.username} didnt supply any arguments(unmute)`);
            recievedMessage.delete()
            recievedMessage.author.send(`${recievedMessage.author.toString()} You have to have mention someone to unmute them!`)      
        }
    }
    else{
        //sends DM if the author isnt a staff member
        console.log(`${recievedMessage.author.username} is not a staff member(tried to unmute)`);
        recievedMessage.delete()
        recievedMessage.author.send(`${recievedMessage.author.toString()} You don't have access to that command!`)

    }
    
}   

else if (pCmd == 'mute'){
    if (recievedMessage.member.roles.cache.find(r => r.id === staffRole)){
        //checks if there is any arguments
        if(arguments != ''){
        //parameters to check if there is a valid ping
        const mention = arguments[0].match(/^<@!?(\d+)>$/)
            //checks if there is a valid ping
            if (mention){
                let role = recievedMessage.guild.roles.cache.find(r => r.name === mutedRole);
                let member = recievedMessage.mentions.members.first();
                
                //checks if the pinged member is muted
                if (!member.roles.cache.some(rolee => rolee.name === mutedRole)){
                    member.roles.add(role);
                    
                    //checks if there is a provided reason (WIP)
                    //if (arguments[1]){
                    //    if (arguments.slice(1)){
                    //        //defines the reason
                    //        let reasonArr = arguments.slice(1)
                    //        let reason = reasonArr.join(" ")
                    //        let reason = reason.match(/.+(-l)$/)
                    //        
                    //        
//
                    //        if (loud[1]){
                    //            console.log(reason);
//
                    //        }
                    //        
                    //    }
                    //}
                    
                    
                    //deletes message containing the promted command
                    recievedMessage.delete()
                    
                    //finds the log channel based on name provided in config
                    if (recievedMessage.channel.type == 'text') {
                        var logger = recievedMessage.guild.channels.cache.find(
                            channel => channel.name === logChannel
                            
                    );
                        if (logger) { 
                            
                            
                            //sends mute log embed
                            sendLog(recievedMessage, 'alog', 'mute', member)
                            //sends a dm to the muted member saying they have been muted
                            embeds.muteDM(recievedMessage)
                            
                        }
                    }                             
                }
                else{
                    //Sends dm to the staff member telling them theyre being a dum dum
                    console.log(`${recievedMessage.author.username} tried to mute someone that is alrady muted`);
                    recievedMessage.delete()
                    recievedMessage.author.send(`${recievedMessage.author.toString()} That member is already muted`)
                }
            }  else{
                //sends DM if the argument isnt a valid ping
                console.log(`${recievedMessage.author.username} didnt provide a valid ping(mute)`);
                recievedMessage.delete()
                recievedMessage.author.send(`${recievedMessage.author.toString()} You have to provide a valid ping, just like the one at the start of this sentence`)
            }
        }  else {
            //sends DM if there is no arguments
            console.log(`${recievedMessage.author.username} didnt supply any arguments(mute)`);
            recievedMessage.delete()
            recievedMessage.author.send(`${recievedMessage.author.toString()} You have to have mention someone to mute them!`)      
        }
    }
    else{
        //sends DM if the author isnt a staff member
        console.log(`${recievedMessage.author.username} is not a staff member(tried to mute)`);
        recievedMessage.delete()
        recievedMessage.author.send(`${recievedMessage.author.toString()} You don't have access to that command!`)

    }       

    
}
//unfinished
else if (pCmd == 'allmuted'){
    if (member.permissions.has('ADMINISTRATOR')){
        let allMembers = recievedMessage.guild.members
        console.log(allMembers.cache.array.id)
    }
    
}

//crashes the bot on purpose incase admins feels its necessary
else if (pCmd == 'alexaoff') {
    if (member.permissions.has('ADMINISTRATOR')){
        console.log("bye sisters");
        client.role.find()
    }

}
    

//suggestion command
else if (pCmd == 'suggest'){
    if (recievedMessage.channel.type == 'text') {
        //finds channel for suggestions after specified channel name
        var logger2 = recievedMessage.guild.channels.cache.find(
            channel => channel.name === 'suggestions-for-bot'

            
    );
        if (logger2) { 
            //embed for suggestion
            const SuggestionEmbed = new Discord.MessageEmbed()
            .setTitle('Suggestion Recieved!')
            .addField('Author of Suggestion:', '<@' + recievedMessage.author.id + '>')
            .addField('Suggestion:', recievedMessage.content)
            .setThumbnail("https://i.imgur.com/IPNxl5W.png")
            .setColor('#b8002e');
            
            logger2.send(SuggestionEmbed);
            recievedMessage.delete()
        }
    }                             
    
    
}
//help command
else if (pCmd == 'help'){
    recievedMessage.channel.send(helpEmbed)
}
//enter new commands above this line
//if a command is not registered the bot returns this. MUST be the last statement of the function to work
else {
    console.log("Sorry, I don't know that one! Try doing `!help` for more commands!");
}
    //this is if what the bot does if there is no staffrole in database
    }else{
        recievedMessage.channel.send('`hey admins you need to provide me a staffrole! do !setup help to see more`')
    }
 

}






//vvv embeds vvv

//Controls what the help command looks like. To add a new field, do .addField. 
const helpEmbed = new Discord.MessageEmbed()
    .setTitle(`My commands list | My prefix is !`)  
    .addField("``Suggest [Suggestion]``", "Sends a suggestion to my developers! THIS IS ONLY MEANT FOR SUGGESTIONS FOR THIS BOT!! If used for other types suggestions you will be punished! (!spank)")
    .addField("Need a bug fixing? Contact my developers", "@Jaack#7159 and @Mc_nobby#6969")
    //gif - .setImage("https://media.giphy.com/media/l0Ex3lGUCkofpN5UQ/giphy.gif")
    .setImage("https://i.imgur.com/48H0ILI.png") //transparent logo
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor("#42e3b8")

//mod help embed, to add new field do .addField




    