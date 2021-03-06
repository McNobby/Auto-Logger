const Discord = require('discord.js')

module.exports.slur = (recievedMessage, logChannel) => {
    const {guild} = recievedMessage

    var alogChannel = guild.channels.cache.find(
        channel => channel.id === logChannel)
    
    const embed = new Discord.MessageEmbed()
    .setTitle(`Slur Usage Detected!`)
    .addField('Offending member;', '<@' + recievedMessage.author.id + '>')
    .addField('Offending message;', recievedMessage.cleanContent)
    .addField('In channel:', recievedMessage.channel.toString())
    .addField('Action taken; ', 'Member Muted. Staff, please unmute using the unmute when you see fit.')
    .addField('React to this message when you unmute the offender!', "Or we will get angry :D")
    .addField('False trigger or something wrong?', 'Please send feedback here: https://mcnobby.github.io/Auto-Logger/feedback')
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#b8002e');
    alogChannel.send(embed)
}

module.exports.muteDM = (recievedMessage) => {
    const { author } = recievedMessage
    const muteDM = new Discord.MessageEmbed()
    .setTitle("You have been muted!")
    .addField("This means:", "That you've broken a rule, or that we've deemed your message inappropiate.")
    .addField("Try to mute evade?","If you mute evade by rejoining the server you will be banned permanently!")
    .addField("False trigger?", "If you belive this was a false trigger, please wait and see if staff unmutes you! Keep in mind they can see the message that triggerd this.")
    .setColor("#b8002e")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")
    author.send(muteDM)
    //makes sure the the bot dosen't crassh incase they have dms off
    .catch(() => console.log("Can't send DM to your user! (disabled dm's)"))
}

module.exports.unMmuteDm = (recievedMessage) => {
    const {author} = recievedMessage
    const unMuteDM = new Discord.MessageEmbed()
    .setTitle("You have been unmuted!")
    .addField("This means:", "That you can go ahead and chat as normal again!, but we'll be keeping an eye on you!")
    .addField("If you get muted again:","You will be one step closer to being banned!")
    .setColor("#03fca9")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")

    author.send(unMuteDM)
    //makes sure the the bot dosen't crassh incase they have dms off
    .catch(() => console.log("Can't send DM to your user! (disabled dm's)"))
}

module.exports.muteLog = (recievedMessage, logChannel, muted) => {
    const {author, guild} = recievedMessage

    var alogChannel = guild.channels.cache.find(
        channel => channel.id === logChannel)

    const MuteEmbed = new Discord.MessageEmbed()
    .setTitle('Member Muted!')
    .addField('Staff Responsible;', `<@${author.id}>`)
    .addField('Person Muted;', muted)
    .addField('False trigger?', 'Send feedback here: https://mcnobby.github.io/Auto-Logger/feedback')
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#b8002e');
    
    alogChannel.send(MuteEmbed)
}

module.exports.onJoin = (systemChannel) => {
    const onJoinembed = new Discord.MessageEmbed()
    .setTitle('Hi There! Thanks for adding me :D')
    .addField("My name's AutoLogger", "But you can call me Alan ;)")
    .addField("I need an Administrator to set me up...", "If that's you, go ahead and run '!setup help'!")
    .addField("I hope I can help you out on your server...", "If you have any questions, contact my developers on https://mcnobby.github.io/Auto-Logger/feedback")
    .setImage("https://media1.tenor.com/images/a7bd6b94430c1e66148d580209e377c5/tenor.gif?itemid=5043108")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#03fca9');
    systemChannel.send(onJoinembed)
}



module.exports.unMuteLog = (recievedMessage, logChannel, member) => {
    const {guild} = recievedMessage
    
    var alogChannel = guild.channels.cache.find(
        channel => channel.id === logChannel)

    const unmuteEmbed = new Discord.MessageEmbed()
    .setTitle('Member Unmuted!')
    .addField('Staff Responsible;', '<@' + recievedMessage.author.id + '>')
    .addField('Person Unmuted;', member)
    .addField('False trigger?', 'Send us feed back here: https://mcnobby.github.io/Auto-Logger/feedback')
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#03fca9');

    alogChannel.send(unmuteEmbed)
}

module.exports.setupHelp = (recievedMessage) => {
    const { channel } = recievedMessage

    const setupHelp = new Discord.MessageEmbed()
    .setTitle('How to setup channels and roles!')
    .addField('The command', '!setup `aLog` or `dLog` or `sRole` `#channel/@role` ')
    .addField("What's aLog?", "Alog is short for Action log and the channel you provide will be where I post the action logs")
    .addField("What's dLog?","Dlog is shord for Deletion log and the channel you provide is where I log all deleted messages from members")
    .addField("What's sRole?", "SRole is short for Staff Role and the role you provide is the staffrole that all staff have. Anyone with staff role will get acsess to all commands in !staffhelp")
    .addField("Anything wrong?", "https://mcnobby.github.io/Auto-Logger/feedback")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#03fca9');

    channel.send(setupHelp)
}

module.exports.staffIntro = (recievedMessage) => {
    const staffhello = new Discord.MessageEmbed()
    .setTitle("Hello! I'm a new bot on the server. You may be wondering what I do!")
    .addField("I'm a bot coded by Nobby and Jack/LaughnCry.", "This means that if you have any questions or suggestions about the bot, DM us!")
    .addField("What is my purpose?", "My main purpose is to make logging and moderation easier for all staff. To see the commands I can do, type !staffhelp")
    .addField("What if staff are asleep while people are spamming slurs?", "No worries! I automatically delete the message, and mute the user; I also log everyones mutes and unmutes for you guys!")
    .setImage("https://media1.tenor.com/images/a7bd6b94430c1e66148d580209e377c5/tenor.gif?itemid=5043108")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor("#34ebdb")

    recievedMessage.channel.send(staffhello)
}

module.exports.staffHelp = (recievedMessage) => {
    const staffhelpembed = new Discord.MessageEmbed()
    .setTitle("Hi, I'm AutoLogger, here to make your life easier. ")
    .addField("!unmute", "This unmutes the user that you have tagged after the command. To tag a user who isn't in the channel you are in, do <@(their Id)>")
    .addField("!mute", "This mutes the user that you have tagged after the command. ")
    .addField("!allismuted", "Under maintenance. Teo and I are working on it as fast as we can D:")
    .addField("!staffhelp", "The command you just used")
    .addField("More questions? Want to tell us just how incredible our bot is? ", "Visit our feedback site! https://mcnobby.github.io/Auto-Logger/feedback")
    .setImage("https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor("#42e3b8")

    recievedMessage.channel.send(staffhelpembed)
}