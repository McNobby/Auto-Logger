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
    .addField('False trigger or something wrong?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159 with a screenshot')
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
    .addField("False trigger?", "If you believe that this is a false trigger you will have to wait 30 minutes and see if you are unmuted by one of our staff. If you are still muted after that time, go ahead and make a ticket appealing your mute (keep in mind, we have the logs)")
    .setColor("#b8002e")
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setImage("https://i.imgur.com/48H0ILI.png")
    author.send(muteDM)
    //makes sure the the bot dosen't crassh incase they have dms off
    .catch(() => console.log("Can't send DM to your user! (disabled dms)"))
}

module.exports.muteLog = (recievedMessage, logChannel, muted) => {
    const {author, guild} = recievedMessage

    var alogChannel = guild.channels.cache.find(
        channel => channel.id === logChannel)

    const MuteEmbed = new Discord.MessageEmbed()
    .setTitle('Member Muted!')
    .addField('Staff Responsible;', `<@${author.id}>`)
    .addField('Person Muted;', muted)
    .addField('False trigger?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159')
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#b8002e');
    
    alogChannel.send(MuteEmbed)
}

module.exports.onJoin = (systemChannel) => {
    const onJoinembed = new Discord.MessageEmbed()
    .setTitle('Hi There! Thanks for adding me :D')
    .addField("My name's AutoLogger", "But you can call me Alan ;)")
    .addField("I need an Administrator to set me up...", "If that's you, go ahead and run '!setup help'!")
    .addField("I hope I can help you out on your server...", "If you have any questions, contact my developers on Github!")
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
    .addField('False trigger?', 'Contact my developers @Mc_nobby#6969 or @Jaack#7159')
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
    .setThumbnail("https://i.imgur.com/IPNxl5W.png")
    .setColor('#03fca9');

    channel.send(setupHelp)
}