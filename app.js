const Discord = require('discord.js')
const client = new Discord.Client()

const { prefix, swears, logChannel, staffRole, adminRole, deletedLog } = require('./config.json')
const { token }  = require('./auth.json')

const commands = require('./commands.js')
const mongo = require('./libraries/mongo')
const loggg = require('./send-log')
const embeds = require('./libraries/embeds')
const eventHandler = require('./event-handler')
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

    //ignores messages from dm's
    if (recievedMessage.channel.type == "dm"){
        return
    }
    
    //checks if message author is bot
    if (recievedMessage.author == client.user) {
        return
    }

//logs recieved message
    console.log(`Mesaage recieved: "${recievedMessage.content}" from: ${recievedMessage.author.tag}`); 

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
    eventHandler('slur', recievedMessage)             
    }
});

//Logs all deleted messages
client.on("messageDelete", (messageDelete) => {

    eventHandler('delete', messageDelete)
 
});

client.on('guildCreate', (newGuild) => {
    const { systemChannel } = newGuild
    embeds.onJoin(systemChannel)
})


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
