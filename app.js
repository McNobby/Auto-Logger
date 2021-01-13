const Discord = require('discord.js')
const client = new Discord.Client()
const { prefix, swears, logChannel, staffRole, adminRole, deletedLog } = require('./config.json')
const { token }  = require('./auth.json')
const commands = require('./commands.js')
const mongo = require('./mongo.js')
const loggg = require('./send-log')

//const cache = {} // guildId.<logType>: [channel, guildId]

//connect 
client.on('ready', async () => {
    console.log("connected as " + client.user.tag);
    client.user.setActivity("With logs", {type: 'PLAYING'})

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
    //ignores messages from dm's
    if (recievedMessage.channel.type == "dm"){
        return
    }
    
    //checks if message author is bot
    if (recievedMessage.author == client.user) {
        return
    }

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
        
        //mod log channel name
        const CHANNEL = 'mod-logs';
        //finds log channel
        if (recievedMessage.channel.type == 'text') {
            var logger = recievedMessage.guild.channels.cache.find(
                channel => channel.name === logChannel
            );
            //sends slur log embed
            if (logger) { 
                   //the embed
                const embed = new Discord.MessageEmbed()
                .setTitle(`Slur Usage Detected!`)
                .addField('Offending member;', '<@' + recievedMessage.author.id + '>')
                .addField('Offending message;', recievedMessage.cleanContent)
                .addField('In channel:', recievedMessage.channel.toString())
                .addField('Action taken; ', 'Member Muted. Staff, please unmute using the unmute when you see fit.')
                .addField('React to this message when you unmute the offender!', "Or we will get angry :D")
                .addField('False trigger or something wrong?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159 with a screenshot')
                .setThumbnail("https://i.imgur.com/IPNxl5W.png")
                .setColor('#b8002e');
                //send in log channel
                loggg(recievedMessage, 'send', 'slur')
                recievedMessage.author.send(muteDM)
                //makes sure the the bot dosen't 
                .catch(() => console.log("Can't send DM to your user! (disabled dms)"))
            }
            
        }
    }


});

//Logs all deleted messages
client.on("messageDelete", (messageDelete) => {
    //if a message in deleted messages is in dm's its ignored - otherwise bot would crash
    if (messageDelete.channel.type == "dm"){
        return
    }else{
   //finds the deleted messagee log channel
   const {content, author, channel} = messageDelete
   var logger = messageDelete.guild.channels.cache.find(
       channel => channel.name === deletedLog

   );
   //if the channel is found
   if (logger) { 
       //the embed
    //const embed = new Discord.MessageEmbed()
    //.setTitle(`Message Deleted!`)
    //.addField('Author: ', '<@' + messageDelete.author.id + '>')
    //.addField('Deleted Message', messageDelete.cleanContent)
    //.addField('In channel:', messageDelete.channel.toString())
    //.addField('False trigger or something wrong?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159 with a screenshot')
    //.setThumbnail("https://i.imgur.com/IPNxl5W.png")
    //.setColor('#b8002e');
    //send in log channel
    loggg(messageDelete, 'send', 'delete')
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

//vv embeds vv
const muteDM = new Discord.MessageEmbed()
    .setTitle("You have been muted!")
    .addField("This means:", "That you've broken a rule, or that we've deemed your message inappropiate.")
    .addField("Try to mute evade?","If you mute evade by rejoining the server you will be banned permanently!")
    .addField("False trigger?", "If you believe that this is a false trigger you will have to wait 30 minutes and see if you are unmuted by one of our staff. If you are still muted after that time, go ahead and make a ticket appealing your mute (keep in mind, we have the logs)")
    .setColor("#b8002e")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")
