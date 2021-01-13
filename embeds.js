const Discord = require('discord.js')

module.exports.slur = (recievedMessage, logChannel) => {
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
    logChannel.send(embed)
}

module.exports.mutedm = (recievedMessage) => {
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
}