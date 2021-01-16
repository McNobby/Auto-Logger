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
                setup(arguments, guild, author, channel)
            }else{
                embeds.setupHelp(recievedMessage)

            }
            
           
        }else{
            console.log('no admin ;-;');
        }return
    }
    

    else if (pCmd == "intro"){
        if (member.permissions.has('ADMINISTRATOR')){
            recievedMessage.channel.send(staffhello)
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
        recievedMessage.channel.send(staffhelpembed)
    }
    else{
        //sends DM if the author isnt a staff member
        console.log(`${recievedMessage.author.username} is not a staff member(tried to use modhelp)`);
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
                           member.send(unMuteDM)
                           //makes sure the the bot dosen't crash from sneding dm
                           .catch(() => console.log("Can't send DM to your user!"))
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
                            sendLog(recievedMessage, 'alog', 'mute', member, reason)
                            //sends a dm to the muted member saying they have been muted
                            member.send(muteDM)
                            //makes sure the the bot dosen't crash from sneding dm
                            .catch(() => console.log("Can't send DM to your user!"))
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
            .addField('False trigger?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159')
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
const staffhelpembed = new Discord.MessageEmbed()
    .setTitle("Hi, I'm AutoLogger, here to make your life easier. ")
    .addField("!unmute", "This unmutes the user that you have tagged after the command. To tag a user who isn't in the channel you are in, do <@(their Id)>")
    .addField("!mute", "This mutes the user that you have tagged after the command. ")
    .addField("!allismuted", "Under maintenance. Teo and I are working on it as fast as we can D:")
    .addField("!staffhelp", "The command you just used")
    .addField("More questions? Want to tell us just how incredible our bot is? ", "Just talk to @Mc_nobby or @Jaack")
    .setImage("https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor("#42e3b8")

//embed for letting someone that was muted, know that they have been muted
const muteDM = new Discord.MessageEmbed()
    .setTitle("You have been muted!")
    .addField("This means:", "That you've broken a rule, or that we've deemed your message inappropiate.")
    .addField("Try to mute evade?","If you mute evade by rejoining the server you will be banned permanently!")
    .addField("False trigger?", "If you believe that this is a false trigger you will have to wait 30 minutes and see if you are unmuted. If you are still muted after that time, go ahead and make a ticket appealing your mute (keep in mind, we have the logs)")
    .setColor("#b8002e")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")

//embed for letting someone being unmuted that they are unmuted
const unMuteDM = new Discord.MessageEmbed()
    .setTitle("You have been unmuted!")
    .addField("This means:", "That you can go ahead and chat as normal again!, but we'll be keeping an eye on you!")
    .addField("If you get muted again:","You will be one step closer to being banned!")
    .setColor("#03fca9")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")


const staffhello = new Discord.MessageEmbed()
    .setTitle("Hello! I'm a new bot on the server. You may be wondering what I do!")
    .addField("I'm a bot coded by Nobby and Jack/LaughnCry.", "This means that if you have any questions or suggestions about the bot, DM us!")
    .addField("What is my purpose?", "My main purpose is to make logging and moderation easier for all staff. To see the commands I can do, type !staffhelp")
    .addField("What if staff are asleep while people are spamming slurs?", "No worries! I automatically delete the message, and mute the user; I also log everyones mutes and unmutes for you guys!")
    .setImage("https://media1.tenor.com/images/a7bd6b94430c1e66148d580209e377c5/tenor.gif?itemid=5043108")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor("#34ebdb")

    