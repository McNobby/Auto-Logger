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