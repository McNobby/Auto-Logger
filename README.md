# Auto-Logger
Developed by Jack Sweeney and Teodor Bøe. A moderation bot that logs and performs commands.

The bot's primary function is to detect, remove, mute and log users that include slurs in their messages, in the fastest most clean way.
Its designed to ignore spaces so it can detect slurs written like this: "S  L U   R"
Whenever someone is muted or unmute they will get a direct message from the bot.

The bot has the following commands:
!mute @member [reason]

      ^needs to be a ping
!unmute @member

        ^needs to be a ping
!staffhelp
!help
!suggest

If any argument is wrong the bot sends a direct message to whoever executed it.

If you want to use this in your own discord server, download the source code and go through the config file.
Then make sure node js version 15.5 and discord.js v12.x, and run app.js with node.

Note: Auto Logger is only tested on v15.5 of nodejs.
