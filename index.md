# Auto-Logger
### Developed by Jack Sweeney and Teodor Bøe. A moderation bot that logs and performs commands.

The bot's primary function is to detect, remove, mute and log users that include slurs in their messages, in the fastest most clean way.
Its designed to ignore spaces so it can detect slurs written like this: "S  L U   R".
Whenever someone is muted or unmute they will get a direct message from the bot.

# Commands

      !mute @member [reason]
             ^needs to be a ping
      
      !unmute @member
               ^needs to be a ping

      !staffhelp

      !setup <alog \ dlog \ srole \ help> 

      !suggest

Whenever someone with the right permissions get the arguments wrong, autologger sends a direct message.

# Want autologger in your server?

As of now autologger is not compleatly ready to join any server, but we are working hard to acheive this. In the mean time you could try to host it yourself!

# Want to host autologger for yourself?
If you want to use this in your own discord server, download the source code and go through the config file.
Then make sure node js version 15.5 and discord.js v12.x and latest mongoose is installed, and run app.js with node.

Make a auth.json file and write the following:
      
      {
      "token": "YOUR BOT TOKEN HERE",
      "mongoPath: "YOUR MONGODB ADRESS"
      }

**Note: Auto Logger is only known to work with node.js v15**
