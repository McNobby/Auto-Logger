const Discord = require('discord.js')
const client = new Discord.Client()

const { prefix, swears, logChannel, staffRole, adminRole, deletedLog } = require('./config.json')
const { token }  = require('./auth.json')

const commands = require('./commands.js')
const mongo = require('./libraries/mongo')
const loggg = require('./send-log')
const embeds = require('./libraries/embeds')
const staffrole = require('./libraries/staffrole')

const NodeChache = require('node-cache')
const myCache = new NodeChache( { stdTTL: 0, checkperiod: 0 } )


//connect 
client.on('ready', async () => {
    console.log("connected as " + client.user.tag);
    client.user.setActivity("Alan", {type: 'WATCHING'})

    await mongo().then((mongoose) => {
        try{
            console.log('Connected to mongo')
        }finally{
            mongoose.connection.close()
        }
    })
 
})

client.login(token)

//message listener
client.on('message', (recievedMessage) => {
   const { guild } = recievedMessage
    //ignores messages from dm's
    if (recievedMessage.channel.type == "dm"){
        return
    }
    
    //checks if message author is bot
    if (recievedMessage.author == client.user) {
        return
    }
    staffrole.main(recievedMessage)

//logs recieved message
    console.log(`Mesaage recieved: "${recievedMessage.content}" from: ${recievedMessage.author.username}`); 

    //checks if message contains the prefix
    if (recievedMessage.content.startsWith(prefix)){
        processCommand(recievedMessage)

    }

    //slur filter
    //checks if any message contains any word from the swear array in config.json
    //makes the input lowercase (.lowercase())
    //also removes all spaces with (.replace(/\s+/g)) to detect slurs written like this: S L U R
        //\s+ is all whitespaces, /g is global. so it replaces all whitespace in global with '', in other words nothing
if(swears.some(word => recievedMessage.content.toLowerCase().replace(/\s+/g, '').includes(word))){
    if (recievedMessage.member.roles.cache.find(r => r.name === staffRole)){
        return
    }
        
    //sends a warning that slurs are not tolerated, and deleted the message containing the slur
        recievedMessage.channel.send("Slurs are not tolerated <@" + recievedMessage.author.id + ">")
        recievedMessage.delete()
        .catch(console.error);

        //gives the offending member the role named Muted
        let role = recievedMessage.guild.roles.cache.find(r => r.name === "Muted");
        let member = recievedMessage.member
        //mutedroleid for test server 793074569433972736
        member.roles.add(role);
        

          //sends slur log embed
          //send in log channel
          loggg(recievedMessage, 'send', 'slur')
          embeds.muteDM(recievedMessage)
            
        
    }
});

//Logs all deleted messages
client.on("messageDelete", (messageDelete) => {

    //if a message in deleted messages is in dm's its ignored - otherwise bot would crash
    if (messageDelete.channel.type == "dm"){
        return
    }else{
        if (messageDelete.member.roles.cache.find(r => r.name === staffRole)){
            return
        }else{
               //finds the deleted messagee log channel
            const {content, author, channel} = messageDelete
            var logger = messageDelete.guild.channels.cache.find(
                channel => channel.name === deletedLog);
            //if the channel is found
            if (logger) { 
             loggg(messageDelete, 'send', 'delete')
 
            }
        }
    }

 
});


//processes the promted command, and checks if its valid Jeg har ingen will to live
function processCommand(recievedMessage){
    let fullCommand = recievedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log(`primary command: "${primaryCommand}" from ${recievedMessage.author.username}`);
    
    //hands off user input the the command.js command function
    commands.command(recievedMessage, primaryCommand, arguments)
}
