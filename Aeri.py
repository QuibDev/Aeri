# Aeri.py

import discord

from requests.api import get
from config import *
import re
from functions import *

client = discord.Client()


@client.event
async def on_ready():


    await client.change_presence(
        status=discord.Status.online,
        activity=discord.Game('Type "Aeri help me!" to chat!')
        )

    # [debug] Print out the server joined and server members in console
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    print(
        f'{client.user} has connected to Discord!'
        f'{guild.name}(id:{guild.id})'
        )
        
    members = '\n -'.join([member.name for member in guild.members])
    print(f'Server Members:\n - {members}')


@client.event
async def on_message(message):
    if message.author == client.user:
        return


    # if the message mentions Aeri we proceed other wise abort -->
    if "aeri" in message.content.lower():      
      user = message.author.mention
  
      if re.search("<@(.*?)\>", message.content.lower()):

          # aeri user mention emotion -->
          try:
            mentionedUser = re.findall("(<@.*?>)",message.content)[0]
          except IndexError:
              print("!INDEX ERROR: MESSAGE: {}".format(message.content))
              mentionedUser = None

          # search for the emotions in the message
          emotion = getEmotion(message)
          response, gif = getResponse(emotion,mentionedUser)

          # send response --> 
          await message.channel.send('{} {}'.format(response,mentionedUser))
          # help message would return a null gif that's why I'm checking it out
          if gif:
              await message.channel.send('{}'.format(gif))

      else:        

        # aeri self user emotion -->        
        emotion = getEmotion(message)
        response, gif = getResponse(emotion,user)      

        # send response --> 
        await message.channel.send('{} {}'.format(response,user))
        # help message would return a null gif that's why I'm checking it out
        if gif:
            await message.channel.send('{}'.format(gif))
 

      # [debugging] this will be printed on terminal not shown to the user
      print("{} | {} | detected emotion: {}".format(message.author.display_name, message.content, emotion.strip()))                        
                      

    else:
      pass
        


client.run(TOKEN)

